import { EventEmitter } from './EventEmitter';
import { Source } from './MultiTrackPlayer';
import { AudioLoader } from './AudioLoader';

export enum TrackState {
    EMPTY = 'EMPTY',
    LOADING = 'LOADING',
    PAUSED = 'PAUSED',
    PLAYING = 'PLAYING',
    ENDED = 'ENDED',
}

export type TrackStateChanged = {
    from: TrackState;
    to: TrackState;
};

export type TrackEventTypes = {
    statechange: TrackStateChanged;
    mutechange: boolean;
};

class Track extends EventEmitter<TrackEventTypes> {
    private _source: Source;
    private _state: TrackState;
    private _audioContext: AudioContext;
    private _audioLoader: AudioLoader;
    private _trackSource?: AudioBufferSourceNode;
    private _gainNode: GainNode;
    private _audioBuffer?: AudioBuffer;
    private _volume: number;
    private _muted: boolean;

    constructor(source: Source, audioLoader: AudioLoader, audioContext: AudioContext) {
        super();
        this._source = source;
        this._volume = 1;
        this._muted = false;
        this._audioContext = audioContext;
        this._audioLoader = audioLoader;
        this._gainNode = audioContext.createGain();
        this._gainNode.connect(audioContext.destination);
        this._state = TrackState.EMPTY;
    }

    async load(): Promise<void> {
        if (this._state === TrackState.EMPTY) {
            this.state = TrackState.LOADING;
            const arrayBuffer = await this._audioLoader.load(this._source.src);
            this._audioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
            this.state = TrackState.PAUSED;
        }
    }

    play(offset = 0): void {
        if (this._state === TrackState.PAUSED || this._state === TrackState.ENDED) {
            this._trackSource = this._audioContext.createBufferSource();
            this._trackSource.buffer = this._audioBuffer!;
            this._trackSource.onended = () => {
                // happens asynchronously after stop has been called, or the track has completed playing
                this._trackSource?.disconnect();
                this._trackSource = undefined;
                this.state =
                    this.state === TrackState.PLAYING ? TrackState.ENDED : TrackState.PAUSED;
            };
            this._trackSource.connect(this._gainNode);
            this._trackSource.start(0, offset);
            this.state = TrackState.PLAYING;
        }
    }

    pause(): void {
        if (this._state === TrackState.PLAYING) {
            this._trackSource?.stop(0);
            this.state = TrackState.PAUSED;
        }
    }

    clear(): void {
        if (this._state !== TrackState.EMPTY) {
            this.allOff();
            if (this._trackSource) {
                this._trackSource.onended = null;
                this._trackSource.stop(0);
                this._trackSource = undefined;
            }
            this._gainNode.disconnect();
            this.state = TrackState.EMPTY;
        }
    }

    get source() {
        return this._source;
    }

    get duration(): number | undefined {
        return this._audioBuffer?.duration;
    }

    get volume(): number {
        return this._volume;
    }

    set volume(volume: number) {
        this._gainNode.gain.value = volume;
        this._volume = volume;
        if (volume > 0) {
            this._muted = false;
        }
    }

    get muted() {
        return this._muted;
    }

    set muted(muted: boolean) {
        this._gainNode.gain.value = muted ? 0 : this._volume;
        this._muted = muted;
        this.emit('mutechange', muted);
    }

    // @ts-ignore
    public get state(): TrackState {
        return this._state;
    }

    // @ts-ignore
    set state(to: TrackState) {
        const from = this._state;
        this._state = to;
        if (from !== to) {
            this.emit('statechange', { from, to });
        }
    }
}

export default Track;

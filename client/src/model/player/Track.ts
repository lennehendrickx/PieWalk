import { EventEmitter } from './EventEmitter';

export enum TrackState {
    CLEARED = 'CLEARED',
    PAUSED = 'PAUSED',
    PLAYING = 'PLAYING',
    ENDED = 'ENDED',
}

export type TrackStateChanged = {
    from: TrackState;
    to: TrackState;
};

type EventTypes = {
    stateChange: TrackStateChanged;
};

class Track extends EventEmitter<EventTypes> {
    private _state: TrackState;
    private _audioContext: AudioContext;
    private _trackSource: AudioBufferSourceNode | undefined;
    private _gainNode: GainNode;
    private _audioBuffer: AudioBuffer;
    private _volume: number;
    private _muted: boolean;

    constructor(audioBuffer: AudioBuffer, audioContext: AudioContext) {
        super();
        this._volume = 1;
        this._muted = false;
        this._audioBuffer = audioBuffer;
        this._audioContext = audioContext;
        this._gainNode = audioContext.createGain();
        this._gainNode.connect(audioContext.destination);
        this._state = TrackState.PAUSED;
    }

    public play(offset = 0): void {
        if (this._state === TrackState.PAUSED || this._state === TrackState.ENDED) {
            this._trackSource = this._audioContext.createBufferSource();
            this._trackSource.buffer = this._audioBuffer;
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

    public pause(): void {
        if (this._state === TrackState.PLAYING) {
            this._trackSource?.stop(0);
            this.state = TrackState.PAUSED;
        }
    }

    public clear(): void {
        if (this._state !== TrackState.CLEARED) {
            this.allOff();
            if (this._trackSource) {
                this._trackSource.onended = null;
                this._trackSource.stop(0);
                this._trackSource = undefined;
            }
            this._gainNode.disconnect();
            this.state = TrackState.CLEARED;
        }
    }

    public get duration(): number | undefined {
        return this._audioBuffer?.duration;
    }

    public get volume(): number {
        return this._volume;
    }

    public set volume(volume: number) {
        this._gainNode.gain.value = volume;
        this._volume = volume;
        if (volume > 0) {
            this._muted = false;
        }
    }

    public get muted() {
        return this._muted;
    }

    public set muted(muted: boolean) {
        this._gainNode.gain.value = muted ? 0 : this._volume;
        this._muted = muted;
    }

    // @ts-ignore
    public get state(): TrackState {
        return this._state;
    }

    // @ts-ignore
    private set state(to: TrackState) {
        const from = this._state;
        this._state = to;
        if (from !== to) {
            this.emit('stateChange', { from, to });
        }
    }
}

export default Track;

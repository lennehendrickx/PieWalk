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
    private _audioBuffer: AudioBuffer;

    constructor(audioBuffer: AudioBuffer, audioContext: AudioContext) {
        super();
        this._audioBuffer = audioBuffer;
        this._audioContext = audioContext;
        this._state = TrackState.PAUSED;
    }

    public play(offset = 0):void {
        if (this._state === TrackState.PAUSED || this._state === TrackState.ENDED) {
            this._trackSource = this._audioContext.createBufferSource();
            this._trackSource.buffer = this._audioBuffer;
            this._trackSource.connect(this._audioContext.destination);
            this._trackSource.onended = () => {
                // happens asynchronously after stop has been called, or the track has completed playing
                this._trackSource?.disconnect();
                this._trackSource = undefined;
                this.state = this.state === TrackState.PLAYING
                    ? TrackState.ENDED
                    : TrackState.PAUSED;
            };
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
            this.state = TrackState.CLEARED;
        }
    }

    // @ts-ignore
    public get state():TrackState {
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

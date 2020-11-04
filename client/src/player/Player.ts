import Track from './Track';
import { AudioLoader } from './AudioLoader';
import { EventEmitter } from './EventEmitter';

export enum PlayerState {
    EMPTY = 'EMPTY',
    PAUSED = 'PAUSED',
    PLAYING = 'PLAYING',
}

export type PlayerStateChanged = {
    from: PlayerState;
    to: PlayerState;
};

type EventTypes = {
    stateChange: PlayerStateChanged;
};

class MultitrackPlayer extends EventEmitter<EventTypes> {
    private _state: PlayerState;
    private readonly _audioContext: AudioContext;
    private _audioLoader: AudioLoader;
    private _track: Track | undefined;

    constructor(audioLoader: AudioLoader) {
        super();
        this._state = PlayerState.EMPTY;
        this._audioLoader = audioLoader;
        // for cross browser compatibility
        // @ts-ignore
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this._audioContext = new AudioContext();
    }

    get state(): PlayerState {
        return this._state;
    }

    async load(path: string): Promise<void> {
        const arrayBuffer = await this._audioLoader.load(path);
        const audioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
        this._track = new Track(audioBuffer, this._audioContext);
        this._changeState(PlayerState.PAUSED);
    }

    async play() {
        await this._resumeAudioContext();
        if (this._state === PlayerState.PAUSED) {
            this._track?.play();
            this._changeState(PlayerState.PLAYING);
        }
    }

    async pause() {
        if (this._state === PlayerState.PLAYING) {
            this._track?.pause();
            this._changeState(PlayerState.PAUSED);
        }
    }

    clear() {
        if (this._state === PlayerState.EMPTY) {
            return;
        }

        this._track?.stop();
        this._track = undefined;
        this._changeState(PlayerState.EMPTY);
    }

    private async _resumeAudioContext(): Promise<void> {
        if (this._audioContext.state === 'suspended') {
            await this._audioContext.resume();
        }
    }

    private _changeState(to: PlayerState) {
        const from = this._state;
        this._state = to;
        this.emit('stateChange', { from, to });
    }
}

export default MultitrackPlayer;

import Track, { TrackState } from './Track';
import { AudioLoader } from './AudioLoader';
import { EventEmitter } from './EventEmitter';

export enum PlayerState {
    EMPTY = 'EMPTY',
    LOADING = 'LOADING',
    PAUSED = 'PAUSED',
    PLAYING = 'PLAYING',
    ENDED = 'ENDED',
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
    private _tracks: Array<Track>;
    private _currentTime: number;
    private _startTime: number;

    constructor(audioLoader: AudioLoader) {
        super();
        this._state = PlayerState.EMPTY;
        this._tracks = [];
        this._currentTime = this._startTime = 0;
        this._audioLoader = audioLoader;
        // for cross browser compatibility
        // @ts-ignore
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this._audioContext = new AudioContext();
    }

    async load(paths: Array<string>): Promise<void> {
        this.clear();
        this.state = PlayerState.LOADING;
        this._tracks = await Promise.all(paths.map(track => this._createTrack(track)));
        this.state = PlayerState.PAUSED;
    }

    private async _createTrack(path: string): Promise<Track> {
        const arrayBuffer = await this._audioLoader.load(path);
        const audioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
        const track = new Track(audioBuffer, this._audioContext);
        track.on('stateChange', ({ to }) => {
            if (to === TrackState.ENDED && this._tracks.every(({ state }) => state === TrackState.ENDED)) {
                this._currentTime = this._startTime = 0;
                this.state = PlayerState.ENDED;
            }
        });
        return track;
    }

    async play(): Promise<void> {
        await this._resumeAudioContext();
        if (this._state === PlayerState.PAUSED || this._state === PlayerState.ENDED) {
            this._startTime = this._audioContext.currentTime;
            this._tracks.forEach(track => track.play(this._currentTime));
            this.state = PlayerState.PLAYING;
        }
    }

    pause(): void {
        if (this._state === PlayerState.PLAYING) {
            this._tracks.forEach(track => track.pause());
            const offset = this._audioContext.currentTime - this._startTime;
            this._currentTime = this._currentTime + offset;
            this.state = PlayerState.PAUSED;
        }
    }

    clear(): void {
        if (this._state === PlayerState.EMPTY) {
            return;
        }

        this._tracks.forEach(track => track.clear());
        this._tracks = [];
        this._startTime = this._currentTime = 0;
        this.state = PlayerState.EMPTY;
    }

    private async _resumeAudioContext(): Promise<void> {
        if (this._audioContext.state === 'suspended') {
            await this._audioContext.resume();
        }
    }

    // @ts-ignore
    get state(): PlayerState {
        return this._state;
    }

    // @ts-ignore
    private set state(to: PlayerState) {
        const from = this._state;
        this._state = to;
        if (from !== to) {
            this.emit('stateChange', { from, to });
        }
    }
}

export default MultitrackPlayer;

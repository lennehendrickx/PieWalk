import Track, { TrackState } from './Track';
import { AudioLoader } from './AudioLoader';
import { EventEmitter } from './EventEmitter';
import scheduleWhile from './Scheduler';

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

export type PlayerEventTypes = {
    statechange: PlayerStateChanged;
    timeupdate: number;
};

export type Source = {
    src: string;
    name: string;
};

class MultiTrackPlayer extends EventEmitter<PlayerEventTypes> {
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
        this.on('statechange', ({ to }) => {
            if (to === PlayerState.PLAYING) {
                scheduleWhile({
                    predicate: () => this._state === PlayerState.PLAYING,
                    callback: () => this.emitTimeUpdate(),
                    interval: 50,
                });
            } else {
                this.emitTimeUpdate();
            }
        });
    }

    get tracks() {
        return this._tracks;
    }

    async load(sources: Array<Source>): Promise<void> {
        if (sources.length === 0) {
            return;
        }

        this.clear();
        this._tracks = await sources.map((song) => this._createTrack(song));
        this.state = PlayerState.LOADING;
        await Promise.all(this._tracks.map((track) => track.load()));
        this.state = PlayerState.PAUSED;
    }

    private _createTrack(source: Source): Track {
        const track = new Track(source, this._audioLoader, this._audioContext);
        track.on('statechange', ({ to }) => {
            if (
                to === TrackState.ENDED &&
                this._tracks.every(({ state }) => state === TrackState.ENDED)
            ) {
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
            this._tracks.forEach((track) => track.play(this._currentTime));
            this.state = PlayerState.PLAYING;
        }
    }

    pause(): void {
        if (this._state === PlayerState.PLAYING) {
            this._tracks.forEach((track) => track.pause());
            this._currentTime = this.currentTime;
            this.state = PlayerState.PAUSED;
        }
    }

    stop(): void {
        this.pause();
        this.currentTime = 0;
    }

    clear(): void {
        if (this._state === PlayerState.EMPTY) {
            return;
        }

        this._tracks.forEach((track) => track.clear());
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
            this.emit('statechange', { from, to });
        }
    }

    get currentTime() {
        if (this._state === PlayerState.PLAYING) {
            const offset = this._audioContext.currentTime - this._startTime;
            return this._currentTime + offset;
        }

        return this._currentTime;
    }

    set currentTime(currentTime) {
        const currentState = this._state;
        if (currentState === PlayerState.PLAYING) {
            this.pause();
        }

        this._currentTime = this._startTime = currentTime;
        this.emitTimeUpdate();

        if (currentState === PlayerState.PLAYING) {
            this.play();
        }
    }

    public get duration(): number | undefined {
        return this._tracks
            .map(({ duration }) => duration)
            .reduce(
                (previousDuration, duration) =>
                    duration === undefined || previousDuration === undefined
                        ? undefined
                        : Math.max(previousDuration, duration),
                0
            );
    }

    private emitTimeUpdate() {
        this.emit('timeupdate', this.currentTime);
    }
}

export default MultiTrackPlayer;

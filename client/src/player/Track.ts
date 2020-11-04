enum TrackState {
    PAUSED = 'PAUSED',
    PLAYING = 'PLAYING',
}

class Track {
    private _state: TrackState;
    private _audioContext: AudioContext;
    private _trackSource: AudioBufferSourceNode | undefined;
    private _audioBuffer: AudioBuffer;
    private _currentTime: number;
    private _startTime: number;

    constructor(audioBuffer: AudioBuffer, audioContext: AudioContext) {
        this._audioBuffer = audioBuffer;
        this._audioContext = audioContext;
        this._currentTime = this._startTime = 0;
        this._state = TrackState.PAUSED;
    }

    public async play(): Promise<void> {
        if (this._state === TrackState.PLAYING) {
            return;
        }

        // Take a copy of ArrayBuffer, since decodeAudioData detaches the ArrayBuffer
        this._trackSource = this._audioContext.createBufferSource();
        this._trackSource.buffer = this._audioBuffer;
        this._trackSource.connect(this._audioContext.destination);
        this._trackSource.onended = () => {
            // happens asynchronously after stop has been called, or the track has completed playing
            this._trackSource?.disconnect();
            this._trackSource = undefined;
            if (this._state === TrackState.PLAYING) {
                this._currentTime = this._startTime = 0;
                this._state = TrackState.PAUSED;
            }
        };
        this._trackSource.start(0, this._currentTime);
        this._startTime = this._audioContext.currentTime;
        this._state = TrackState.PLAYING;
    }

    public pause(): void {
        if (this._state === TrackState.PAUSED) {
            return;
        }
        this.stop();
        const offset = this._audioContext.currentTime - this._startTime;
        this._currentTime = this._currentTime + offset;
    }

    public stop() {
        this._trackSource?.stop(0);
        this._state = TrackState.PAUSED;
    }
}

export default Track;

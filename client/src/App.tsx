import React, {useEffect} from 'react';
import './App.css';

interface AudioLoader {
  load(path:string):Promise<ArrayBuffer>
}

class FetchAudioLoader implements AudioLoader {

  private static SERVER_URL:String = 'http://localhost:8080';

  async load(path:string):Promise<ArrayBuffer> {
    const response = await fetch(`${FetchAudioLoader.SERVER_URL}/track/load?path=${path}`);
    return await response.arrayBuffer();
  }

}

enum TrackState {
  PAUSED, PLAYING
}

class Track {
  private _state: TrackState;
  private _audioContext:AudioContext;
  private _trackSource: AudioBufferSourceNode | undefined;
  private _audioBuffer: AudioBuffer;
  private _currentTime: number;
  private _startTime: number;

  constructor(audioBuffer: AudioBuffer, audioContext:AudioContext) {
    this._audioBuffer = audioBuffer
    this._audioContext = audioContext;
    this._currentTime = this._startTime = 0;
    this._state = TrackState.PAUSED;
  }

  public async play():Promise<void> {
    if (this._state === TrackState.PLAYING) {
      return;
    }

    // Take a copy of ArrayBuffer, since decodeAudioData detaches the ArrayBuffer
    this._trackSource = this._audioContext.createBufferSource();
    this._trackSource.buffer = this._audioBuffer;
    this._trackSource.connect(this._audioContext.destination)
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

  public pause():void {
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

enum PlayerState {
  EMPTY, PAUSED, PLAYING
}

class MultitrackPlayer {

  private _state: PlayerState;
  private _audioContext: AudioContext;
  private _audioLoader: AudioLoader;
  private _track: Track | undefined;


  constructor(audioLoader:AudioLoader) {
    this._state = PlayerState.EMPTY;
    this._audioLoader = audioLoader;
    // for cross browser compatibility
    // @ts-ignore
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this._audioContext = new AudioContext();

  }

  public clear() {
    if (this._state === PlayerState.EMPTY) {
      return;
    }

    this._track?.stop()
    this._track = undefined;
    this._state = PlayerState.EMPTY;
  }

  async load(path:string):Promise<void> {
    const arrayBuffer = await this._audioLoader.load(path);
    const audioBuffer = await this._audioContext.decodeAudioData(arrayBuffer);
    this._track = new Track(audioBuffer, this._audioContext);
    this._state = PlayerState.PAUSED;
  }

  async play() {
    await this._resumeAudioContext();
    if (this._state === PlayerState.PAUSED) {
      this._track?.play();
      this._state = PlayerState.PLAYING;
    }
  }

  async pause() {
    if (this._state === PlayerState.PLAYING) {
      this._track?.pause();
      this._state = PlayerState.PAUSED;
    }
  }

  private async _resumeAudioContext():Promise<void> {
    if (this._audioContext.state === 'suspended') {
      await this._audioContext.resume();
    }
  }

}

const audioLoader = new FetchAudioLoader();
const player = new MultitrackPlayer(audioLoader);

function App() {

  useEffect(() => {
    player.load('/Users/lennehendrickx/Documents/karaoke-version-lijst/Billy_Joel_Piano_Man/Piano_Custom_Backing_Track.mp3');
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={player.play.bind(player)}>Play</button>
        <button onClick={player.pause.bind(player)}>Pause</button>
      </header>

    </div>
  );
}

export default App;

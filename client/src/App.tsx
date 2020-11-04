import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import MultitrackPlayer, { PlayerStateChanged } from './player/Player';
import { FetchAudioLoader } from './player/AudioLoader';

const audioLoader = new FetchAudioLoader();
const player = new MultitrackPlayer(audioLoader);

function App() {
    const [playerState, setPlayerState] = useState(player.state);

    const handlePlayerStateChanged = useCallback(
        ({ to }: PlayerStateChanged) => setPlayerState(to),
        [setPlayerState]
    );

    useEffect(() => {
        player.on('stateChange', handlePlayerStateChanged);
        return () => player.off('stateChange', handlePlayerStateChanged);
    }, [handlePlayerStateChanged]);

    useEffect(() => {
        player.load(
            '/Users/lennehendrickx/Documents/karaoke-version-lijst/Billy_Joel_Piano_Man/Piano_Custom_Backing_Track.mp3'
        );
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <p>{playerState}</p>
                <button onClick={player.play.bind(player)}>Play</button>
                <button onClick={player.pause.bind(player)}>Pause</button>
            </header>
        </div>
    );
}

export default App;

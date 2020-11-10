import React, { useCallback, useEffect, useState } from 'react';
import MultitrackPlayer, { PlayerStateChanged } from '../../model/player/Player';
import { FetchAudioLoader } from '../../model/player/AudioLoader';

const audioLoader = new FetchAudioLoader();
const player = new MultitrackPlayer(audioLoader);

type PlayerProps = {
    tracks: Array<string>
}

function Player({ tracks = [] }: PlayerProps) {
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
        player.load(tracks);
    }, [tracks]);

    return (
        <div className="Player">
            <p>{playerState}</p>
            <button onClick={player.play.bind(player)}>Play</button>
            <button onClick={player.pause.bind(player)}>Pause</button>
        </div>
    );
}

export default Player;

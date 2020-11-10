import React, { useCallback, useEffect, useState } from 'react';
import MultitrackPlayer, { PlayerStateChanged } from '../../model/player/Player';
import { FetchAudioLoader } from '../../model/player/AudioLoader';

const audioLoader = new FetchAudioLoader();
const player = new MultitrackPlayer(audioLoader);

function Player() {
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
            [
                `Billy_Joel_Piano_Man/Accordion_Custom_Backing_Track.mp3`,
                `Billy_Joel_Piano_Man/Acoustic_Guitar_Custom_Backing_Track.mp3`,
                `Billy_Joel_Piano_Man/Bass_Custom_Backing_Track.mp3`,
                `Billy_Joel_Piano_Man/Drum_Kit_Custom_Backing_Track.mp3`,
                `Billy_Joel_Piano_Man/Harmonica_Custom_Backing_Track.mp3`,
                `Billy_Joel_Piano_Man/Lead_Vocal_Custom_Backing_Track.mp3`,
                `Billy_Joel_Piano_Man/Mandolin_Custom_Backing_Track.mp3`,
                `Billy_Joel_Piano_Man/Piano_Custom_Backing_Track.mp3`
            ]
        );
    }, []);

    return (
        <div className="Player">
            <p>{playerState}</p>
            <button onClick={player.play.bind(player)}>Play</button>
            <button onClick={player.pause.bind(player)}>Pause</button>
        </div>
    );
}

export default Player;

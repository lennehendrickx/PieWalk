import React, { useCallback, useEffect, useState } from 'react';
import MultitrackPlayer, { PlayerStateChanged } from '../../model/player/Player';
import { FetchAudioLoader } from '../../model/player/AudioLoader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import { IconButton } from '@material-ui/core';
import { PauseRounded, PlayArrowRounded, StopRounded } from '@material-ui/icons';
import { Song } from '../songlist/SongApi';

const audioLoader = new FetchAudioLoader();
const player = new MultitrackPlayer(audioLoader);

type PlayerProps = {
    song?: Song;
};

function Player({ song }: PlayerProps) {
    const [playerState, setPlayerState] = useState(player.state);
    const [playerCurrentTime, setPlayerCurrentTime] = useState(player.currentTime);

    const handlePlayerStateChanged = useCallback(
        ({ to }: PlayerStateChanged) => setPlayerState(to),
        [setPlayerState]
    );

    useEffect(() => {
        player.on('stateChange', handlePlayerStateChanged);
        return () => player.off('stateChange', handlePlayerStateChanged);
    }, [handlePlayerStateChanged]);

    const handlePlayerCurrentTimeChanged = useCallback(
        (currentTime: number) => setPlayerCurrentTime(currentTime),
        [setPlayerState]
    );

    useEffect(() => {
        player.on('timeUpdate', handlePlayerCurrentTimeChanged);
        return () => player.off('timeUpdate', handlePlayerCurrentTimeChanged);
    }, [handlePlayerCurrentTimeChanged]);

    useEffect(() => {
        if (song) {
            player.load(song.tracks.map(({ path }) => path));
        }
    }, [song]);

    const secondsToClock = (input: number) => {
        const minutes = String(Math.trunc(input / 60)).padStart(2, '0');
        const seconds = String(Math.trunc(input % 60)).padStart(2, '0');
        const millis = String(Math.trunc((input % 1) * 1000)).padStart(3, '0');
        return `${minutes}:${seconds}.${millis}`;
    };

    return (
        <div className="Player">
            <h3>{song ? song.name : 'No song selected'}</h3>
            <h4>Controls</h4>
            <p>{playerState}</p>
            <p>{secondsToClock(playerCurrentTime)}</p>
            <IconButton onClick={player.play.bind(player)} aria-label="play" size="medium">
                <PlayArrowRounded fontSize="inherit" />
            </IconButton>
            <IconButton onClick={player.pause.bind(player)} aria-label="pause" size="medium">
                <PauseRounded fontSize="inherit" />
            </IconButton>
            <IconButton onClick={player.stop.bind(player)} aria-label="stop" size="medium">
                <StopRounded fontSize="inherit" />
            </IconButton>
            <h4>Tracks</h4>
            {song && (
                <List>
                    {song.tracks.map(({ name }) => (
                        <ListItem key={name}>
                            <ListItemText primary={name} />
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
}

export default Player;

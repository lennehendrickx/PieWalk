import React, { useCallback, useEffect, useState } from 'react';
import MultitrackPlayer, { PlayerState, PlayerStateChanged } from '../../model/player/Player';
import { Song } from '../songlist/SongApi';
import { IconButton, LinearProgress, Typography } from '@material-ui/core';
import { PauseCircleFilled, PlayCircleFilled, Stop } from '@material-ui/icons';
import Toolbar from '@material-ui/core/Toolbar';

type ControlBarProps = {
    song?: Song;
    player: MultitrackPlayer;
};

function ControlBar({ song, player }: ControlBarProps) {
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

    const secondsToClock = (input: number) => {
        const minutes = String(Math.trunc(input / 60)).padStart(2, '0');
        const seconds = String(Math.trunc(input % 60)).padStart(2, '0');
        const millis = String(Math.trunc((input % 1) * 1000)).padStart(3, '0');
        return `${minutes}:${seconds}.${millis}`;
    };

    return (
        <React.Fragment>
            <Toolbar style={{ justifyContent: 'center' }}>
                {playerState === PlayerState.PLAYING ? (
                    <IconButton color="inherit" onClick={player.pause.bind(player)}>
                        <PauseCircleFilled />
                    </IconButton>
                ) : (
                    <IconButton color="inherit" onClick={player.play.bind(player)}>
                        <PlayCircleFilled />
                    </IconButton>
                )}
                <IconButton color="inherit" onClick={player.stop.bind(player)}>
                    <Stop />
                </IconButton>
                <LinearProgress
                    style={{ width: 300, margin: '0 20px' }}
                    variant="determinate"
                    value={player.duration ? (playerCurrentTime / player.duration) * 100 : 0}
                />
                <Typography variant={'caption'}>
                    {secondsToClock(playerCurrentTime)} / {secondsToClock(player.duration || 0)} (
                    {playerState})
                </Typography>
            </Toolbar>
        </React.Fragment>
    );
}

export default ControlBar;

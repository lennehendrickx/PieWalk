import React from 'react';
import MultitrackPlayer, {
    PlayerEventTypes,
    PlayerState,
} from '../../model/player/MultiTrackPlayer';
import { Song } from '../songlist/SongApi';
import { IconButton, LinearProgress, Typography, Toolbar } from '@material-ui/core';
import { PauseCircleFilled, PlayCircleFilled, Stop } from '@material-ui/icons';
import useEmitterState from '../use-emitter-state';

type ControlBarProps = {
    song?: Song;
    player: MultitrackPlayer;
};

function ControlBar({ song, player }: ControlBarProps) {
    const playerState = useEmitterState<PlayerState, PlayerEventTypes, 'statechange'>({
        target: player,
        eventName: 'statechange',
        eventMapper: ({ to }) => to,
        initialState: player.state,
    });
    const playerCurrentTime = useEmitterState<number, PlayerEventTypes, 'timeupdate'>({
        target: player,
        eventName: 'timeupdate',
        initialState: player.currentTime,
    });

    const secondsToClock = (input: number) => {
        const minutes = String(Math.trunc(input / 60)).padStart(2, '0');
        const seconds = String(Math.trunc(input % 60)).padStart(2, '0');
        const millis = String(Math.trunc((input % 1) * 1000)).padStart(3, '0');
        return `${minutes}:${seconds}.${millis}`;
    };

    const clock = () =>
        `${secondsToClock(playerCurrentTime ?? 0)} / ${secondsToClock(player.duration ?? 0)}`;

    const toProgress = () => {
        const currentTime = playerCurrentTime ?? 0;
        return player.duration !== undefined ? (currentTime / player.duration) * 100 : 0;
    };

    return (
        <React.Fragment>
            <Toolbar style={{ justifyContent: 'center' }}>
                {playerState === PlayerState.PLAYING ? (
                    <IconButton color="inherit" onClick={() => player.pause()}>
                        <PauseCircleFilled />
                    </IconButton>
                ) : (
                    <IconButton color="inherit" onClick={() => player.play()}>
                        <PlayCircleFilled />
                    </IconButton>
                )}
                <IconButton color="inherit" onClick={() => player.stop()}>
                    <Stop />
                </IconButton>
                <LinearProgress
                    style={{ width: 300, margin: '0 20px' }}
                    variant="determinate"
                    value={toProgress()}
                />
                <Typography variant={'caption'}>
                    {clock()} ({playerState})
                </Typography>
            </Toolbar>
        </React.Fragment>
    );
}

export default ControlBar;

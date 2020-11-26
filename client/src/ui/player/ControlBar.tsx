import React, { MouseEvent } from 'react';
import MultitrackPlayer, { PlayerState } from '../../model/player/MultiTrackPlayer';
import { Song } from '../songlist/SongApi';
import {
    createStyles,
    IconButton,
    LinearProgress,
    Theme,
    Toolbar,
    Typography,
    withStyles,
} from '@material-ui/core';
import { PauseCircleFilled, PlayCircleFilled, Stop } from '@material-ui/icons';
import useEmitterState from '../use-emitter-state';

type ControlBarProps = {
    song?: Song;
    player: MultitrackPlayer;
};

const ProgressBar = withStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 10,
        },
        bar: {
            transition: `transform .1s linear`,
        },
    })
)(LinearProgress);

function ControlBar({ song, player }: ControlBarProps) {
    const playerState = useEmitterState({
        target: player,
        eventName: 'statechange',
        eventMapper: ({ to }): PlayerState => to,
        initialState: player.state,
    });
    const playerCurrentTime = useEmitterState({
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

    const toClickXPercentage = (event: MouseEvent) => {
        const targetBoundingClientRect = event.currentTarget.getBoundingClientRect();
        const targetX = window.scrollX + targetBoundingClientRect.x;
        const targetWidth = targetBoundingClientRect.width;
        const clickX = event.pageX;
        const xInProgress = clickX - targetX;
        return xInProgress / targetWidth;
    };

    const handleMouseUp = (event: MouseEvent) => {
        if (player.duration) {
            const clickXPercentage = toClickXPercentage(event);
            player.currentTime = clickXPercentage * player.duration;
        }
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
                <ProgressBar
                    style={{ width: 300, margin: '0 20px' }}
                    variant="determinate"
                    value={toProgress()}
                    onMouseUp={handleMouseUp}
                />
                <Typography variant={'caption'}>
                    {clock()} ({playerState})
                </Typography>
            </Toolbar>
        </React.Fragment>
    );
}

export default ControlBar;

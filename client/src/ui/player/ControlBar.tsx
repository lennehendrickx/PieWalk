import React, { MouseEvent } from 'react';
import MultitrackPlayer, { PlayerState } from '../../model/player/MultiTrackPlayer';
import { Song } from '../songlist/SongApi';
import { IconButton, LinearProgress, Toolbar, Typography } from '@material-ui/core';
import { PauseCircleFilled, PlayCircleFilled, Stop } from '@material-ui/icons';
import useEmitterState from '../use-emitter-state';

type ControlBarProps = {
    song?: Song;
    player: MultitrackPlayer;
};

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
        // @ts-ignore
        const targetBoundingClientRect = event.target.getBoundingClientRect();
        const targetX = window.scrollX + targetBoundingClientRect.x;
        const targetWidth = targetBoundingClientRect.width;
        const clickX = event.pageX;
        const xInProgress = clickX - targetX;
        return xInProgress / targetWidth;
    };

    const handleMouseUp = (event: MouseEvent) => {
        if (player.duration) {
            const clickXPercentage = toClickXPercentage(event);
            console.log(`
                Current time: ${player.currentTime}
                Duration: ${player.duration}
                Click percentage: ${clickXPercentage}
                New current time: ${clickXPercentage * player.duration}
            `);
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
                <LinearProgress
                    style={{ width: 300, margin: '0 20px', padding: '5px 0' }}
                    variant="determinate"
                    value={toProgress()}
                    onMouseUpCapture={handleMouseUp}
                />
                <Typography variant={'caption'}>
                    {clock()} ({playerState})
                </Typography>
            </Toolbar>
        </React.Fragment>
    );
}

export default ControlBar;

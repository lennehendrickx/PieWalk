import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import { IconButton, ListItem } from '@material-ui/core';
import { VolumeOff, VolumeUp } from '@material-ui/icons';
import useEmitterState from '../use-emitter-state';
import Track, { TrackState } from '../../model/player/Track';

type TrackProps = {
    key?: string;
    track: Track;
};

function TrackItem({ track }: TrackProps) {
    const muted = useEmitterState({
        target: track,
        eventName: 'mutechange',
        initialState: track.muted,
    });

    const trackState = useEmitterState({
        target: track,
        eventName: 'statechange',
        eventMapper: ({ to }): TrackState => to,
        initialState: track.state,
    });

    return (
        <ListItem key={track.source.name}>
            <IconButton onClick={() => (track.muted = !muted)}>
                {muted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
            <ListItemText primary={track.source.name} secondary={trackState} />
        </ListItem>
    );
}

export default TrackItem;

import React from 'react';
import ListItemText from '@material-ui/core/ListItemText';
import { IconButton, ListItem } from '@material-ui/core';
import { VolumeOff, VolumeUp } from '@material-ui/icons';
import useEmitterState from '../use-emitter-state';
import Track, { TrackEventTypes, TrackState } from '../../model/player/Track';
import { PlayerEventTypes, PlayerState } from '../../model/player/MultiTrackPlayer';

type TrackProps = {
    track: Track;
};

function TrackItem({ track }: TrackProps) {
    const muted = useEmitterState<boolean, TrackEventTypes, 'mutechange'>({
        target: track,
        eventName: 'mutechange',
        eventMapper: (muted) => muted,
        initialState: track.muted,
    });

    const trackState = useEmitterState<TrackState, TrackEventTypes, 'statechange'>({
        target: track,
        eventName: 'statechange',
        eventMapper: ({ to }) => to,
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

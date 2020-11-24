import React, { useEffect } from 'react';
import MultitrackPlayer, { PlayerEventTypes } from '../../model/player/MultiTrackPlayer';
import List from '@material-ui/core/List';
import { Song } from '../songlist/SongApi';
import useEmitterState from '../use-emitter-state';
import Track from '../../model/player/Track';
import TrackItem from './Track';
import Typography from '@material-ui/core/Typography';

type PlayerProps = {
    song?: Song;
    player: MultitrackPlayer;
};

function TrackOverview({ song, player }: PlayerProps) {
    const playerTracks = useEmitterState<Array<Track>, PlayerEventTypes, 'statechange'>({
        target: player,
        eventName: 'statechange',
        eventMapper: (event) => player.tracks,
        initialState: player.tracks,
    });

    useEffect(() => {
        if (song) {
            const sources = song.tracks.map(({ name, src }) => ({
                name,
                src,
            }));
            player.load(sources);
        }
    }, [song, player]);

    return (
        <div>
            <Typography variant="h5">{song ? song.name : 'No song selected'}</Typography>
            <Typography variant="subtitle1">Tracks</Typography>
            <List>
                {playerTracks?.map((track) => (
                    <TrackItem track={track} />
                ))}
            </List>
        </div>
    );
}

export default TrackOverview;

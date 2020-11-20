import React, { useEffect } from 'react';
import MultitrackPlayer from '../../model/player/Player';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import { Song } from '../songlist/SongApi';

type PlayerProps = {
    song?: Song;
    player: MultitrackPlayer;
};

function TrackOverview({ song, player }: PlayerProps) {
    useEffect(() => {
        if (song) {
            player.load(song.tracks.map(({ path }) => path));
        }
    }, [song]);

    return (
        <div className="Player">
            <h3>{song ? song.name : 'No song selected'}</h3>
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

export default TrackOverview;

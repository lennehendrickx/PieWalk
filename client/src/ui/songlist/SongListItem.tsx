import { Song } from './SongApi';
import React from 'react';
import { Divider, ListItem, ListItemText, Typography } from '@material-ui/core';

type SongListItemProps = {
    song: Song;
    selected: boolean;
    onSelected: (song: Song) => void;
};

export default function SongListItem({ song, selected, onSelected = () => {} }: SongListItemProps) {
    return (
        <React.Fragment key={song.name}>
            <Divider component="li" />
            <ListItem
                button
                selected={selected}
                onClick={() => {
                    onSelected(song);
                }}
            >
                <ListItemText
                    primary={`${song.name} (${song.metadata?.releaseDate})`}
                    secondary={
                        <React.Fragment>
                            <Typography variant={'body2'}>
                                {song.metadata?.genre} - {song.tracks.length} tracks
                            </Typography>
                        </React.Fragment>
                    }
                />
            </ListItem>
        </React.Fragment>
    );
}

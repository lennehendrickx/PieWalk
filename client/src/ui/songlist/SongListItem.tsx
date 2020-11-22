import { Song } from './SongApi';
import React from 'react';
import { Divider, ListItem, ListItemText } from '@material-ui/core';

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
                    primary={song.name}
                    secondary={`Song has ${song.tracks.length} tracks`}
                />
            </ListItem>
        </React.Fragment>
    );
}

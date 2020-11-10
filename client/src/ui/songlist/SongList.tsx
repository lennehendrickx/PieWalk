import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import songApi, { Song } from './SongApi';


type SongListProps = {
    onSongSelected: (song: Song) => void
}


export default function SongList({ onSongSelected = () => {} }: SongListProps) {

    const [songList, setSongList] = useState<Array<Song>>([]);

    useEffect(() => {
        const fetchSongList = async () => {
            const songList = await songApi.list();
            setSongList(songList);
        };
        fetchSongList();
    }, []);

    return (
        <List>
            {songList.map((song) => (
                <ListItem button key={song.name} onClick={() => {
                    onSongSelected(song);
                }}>
                    <ListItemText primary={song.name} />
                </ListItem>
            ))}
        </List>
    );
}

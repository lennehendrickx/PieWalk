import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import songApi, { Song } from './SongApi';


export default function SongList() {

    const [songList, setSongList] = useState<Array<Song>>([]);

    useEffect(() => {
        const fetchSongList = async () => {
            const songList = await songApi.list();
            setSongList(songList);
        }
        fetchSongList();
    }, [])

    return (
        <List>
            {songList.map(({name}) => (
                <ListItem button key={name}>
                    <ListItemText primary={name} />
                </ListItem>
            ))}
        </List>
    );
}

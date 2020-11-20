import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import songApi, { Song } from './SongApi';
import { Divider } from '@material-ui/core';
import SearchBox from './SearchBox';
import useDebounce from './use-debounce';

type SongListProps = {
    selectedSong: Song | undefined;
    onSelectedSongChanged: (song: Song) => void;
};

export default function SongList({
    selectedSong,
    onSelectedSongChanged = () => {},
}: SongListProps) {
    const [songList, setSongList] = useState<Array<Song>>([]);
    const [filteredSongList, setFilteredSongList] = useState<Array<Song>>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce<string>(searchQuery, 10);

    useEffect(() => {
        const fetchSongList = async () => {
            const songList = await songApi.list();
            setSongList(songList);
        };
        fetchSongList();
    }, []);

    useEffect(() => {
        setFilteredSongList(
            songList.filter((song) =>
                song.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            )
        );
    }, [songList, debouncedSearchQuery]);

    return (
        <React.Fragment>
            <SearchBox value={searchQuery} onChange={setSearchQuery} />
            <List>
                {filteredSongList.map((song) => (
                    <React.Fragment key={song.name}>
                        <Divider component="li" />
                        <ListItem
                            button
                            selected={song === selectedSong}
                            onClick={() => {
                                onSelectedSongChanged(song);
                            }}
                        >
                            <ListItemText
                                primary={song.name}
                                secondary={`Song has ${song.tracks.length} tracks`}
                            />
                        </ListItem>
                    </React.Fragment>
                ))}
            </List>
        </React.Fragment>
    );
}

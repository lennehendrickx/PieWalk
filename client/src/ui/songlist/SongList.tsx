import React, { useEffect, useState } from 'react';
import songApi, { Song } from './SongApi';
import SearchBox from './SearchBox';
import { List, Typography } from '@material-ui/core';
import SongListItem from './SongListItem';

type SongListProps = {
    selectedSong?: Song;
    onSelectedSongChanged: (song: Song) => void;
};

export default function SongList({
    selectedSong,
    onSelectedSongChanged = () => {},
}: SongListProps) {
    const [songList, setSongList] = useState<Array<Song>>([]);
    const [filteredSongList, setFilteredSongList] = useState<Array<Song>>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSongList = async () => {
            const songList = await songApi.list();
            setSongList(songList);
        };
        fetchSongList();
    }, []);

    useEffect(() => {
        setFilteredSongList(
            songList.filter((song) => song.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [songList, searchQuery]);

    return (
        <React.Fragment>
            <SearchBox value={searchQuery} onChange={setSearchQuery} />
            <Typography variant="caption" noWrap style={{ margin: '0 15px' }}>
                {filteredSongList.length} out of {songList.length} songs
            </Typography>
            <List>
                {filteredSongList.map((song) => (
                    <SongListItem
                        song={song}
                        selected={song === selectedSong}
                        onSelected={onSelectedSongChanged}
                    />
                ))}
            </List>
        </React.Fragment>
    );
}

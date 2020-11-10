import React, { useState } from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Player from './ui/player/Player';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SongList from './ui/songlist/SongList';
import { Song } from './ui/songlist/SongApi';

const drawerWidth = 300;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex'
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0
        },
        drawerPaper: {
            width: drawerWidth
        },
        drawerContainer: {
            overflow: 'auto'
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3)
        }
    })
);

export default function App() {
    const [song, setSong] = useState<Song>();
    const classes = useStyles();

    const toTracks = (song: Song | undefined) => {
        return song
            ? song.tracks.map(track => `${song.name}/${track.name}`)
            : [];
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        PieWalk Studio
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper
                }}>
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <SongList onSongSelected={setSong} />
                </div>
            </Drawer>
            <main className={classes.content}>
                <Toolbar />
                <Player tracks={toTracks(song)} />
            </main>
        </div>
    );
}

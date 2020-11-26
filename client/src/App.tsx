import React, { useState } from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Tracks from './ui/player/TrackOverview';
import ControlBar from './ui/player/ControlBar';
import {
    createStyles,
    Theme,
    makeStyles,
    createMuiTheme,
    ThemeProvider,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SongList from './ui/songlist/SongList';
import { Song } from './ui/songlist/SongApi';
import blueGray from '@material-ui/core/colors/blueGrey';
import { FetchAudioLoader } from './model/player/AudioLoader';
import MultitrackPlayer from './model/player/MultiTrackPlayer';

const drawerWidth = 300;

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: blueGray,
    },
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBarTop: {
            zIndex: theme.zIndex.drawer + 1,
        },
        appBarBottom: {
            zIndex: theme.zIndex.drawer + 1,
            top: 'auto',
            bottom: 0,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerContainer: {
            overflow: 'auto',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            marginBottom: 40,
        },
        grow: {
            flexGrow: 1,
        },
    })
);

const audioLoader = new FetchAudioLoader();
const player = new MultitrackPlayer(audioLoader);

export default function App() {
    const [song, setSong] = useState<Song>();
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBarTop}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            PieWalk <strong>Studio</strong>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <SongList selectedSong={song} onSelectedSongChanged={setSong} />
                    </div>
                    <Toolbar />
                </Drawer>
                <main className={classes.content}>
                    <Toolbar />
                    <Tracks player={player} song={song} />
                </main>
                <AppBar color="default" position="fixed" className={classes.appBarBottom}>
                    <ControlBar player={player} song={song} />
                </AppBar>
            </div>
        </ThemeProvider>
    );
}

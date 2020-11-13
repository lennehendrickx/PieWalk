import React, { useState } from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Player from './ui/player/Player';
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
import { IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import deepOrange from '@material-ui/core/colors/blueGrey';

const drawerWidth = 300;

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: deepOrange,
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
        },
        grow: {
            flexGrow: 1,
        },
    })
);
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
                        <SongList onSongSelected={setSong} />
                    </div>
                </Drawer>
                <main className={classes.content}>
                    <Toolbar />
                    <Player song={song} />
                </main>
                <AppBar position="fixed" color="primary" className={classes.appBarBottom}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="open drawer">
                            <MenuIcon />
                        </IconButton>
                        <div className={classes.grow} />
                        <IconButton color="inherit">
                            <SearchIcon />
                        </IconButton>
                        <IconButton edge="end" color="inherit">
                            <MoreIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </div>
        </ThemeProvider>
    );
}

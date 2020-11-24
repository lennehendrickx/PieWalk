import { createStyles, fade, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import { InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            margin: theme.spacing(0, 2),
            width: 'auto',
        },
        searchIcon: {
            padding: theme.spacing(0, 1),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(3)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
        },
    })
);

type SearchBoxProps = {
    value: string;
    onChange: (newValue: string) => void;
};

export default function SearchBox({ value, onChange = () => {} }: SearchBoxProps) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <div className={classes.search} style={{ marginTop: 20, marginBottom: 10 }}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>
                <InputBase
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Search…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                />
            </div>
        </React.Fragment>
    );
}

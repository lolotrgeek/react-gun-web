import React from "react";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { orange } from "@material-ui/core/colors";

export const useStyles = makeStyles(theme => ({
    space: {
        paddingTop: theme.spacing(5)
    },
    space2: {
        paddingTop: theme.spacing(3)
    },
    space3: {
        paddingTop: theme.spacing(2)
    },
    spaceBelow: {
        paddingBottom: theme.spacing(2)
    },
    card: {
        marginBottom: theme.spacing(5),
        maxWidth: 360,
        minWidth: 350,
    },
    fit: {
        width: '90%'
    },
    form: {
        '& > *': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
    content: {
        flexGrow: 1,
        overflowX: 'hidden',
        maxWidth: 500,
        minWidth: 350,
    },
    listRoot: {
        flexGrow: 1,
        overflowX: 'hidden',
    },
    listClass: {
        flexGrow: 1,
        maxWidth: 500,
        minWidth: 350,
        marginLeft: 'auto',
        marginRight: 'auto'
    },

    listContent: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    table: {
        minWidth: 350,
      },
}));


export const theme = createMuiTheme({
    status: {
        danger: orange[500]
    },
    maxWidth: 500,
});


export const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
    // TODO: https://material-ui.com/customization/palette/#user-preference
});
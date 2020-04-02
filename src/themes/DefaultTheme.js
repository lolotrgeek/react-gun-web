import React from "react";


export const theme = {
    spacing: scale => scale * 8,
    breakpoint: {
        xs: '0px',
        sm: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1920px'
    }

}

export const useStyles = () => ({
    root: {
        flexGrow: 1,
        marginBottom: '1.2rem'
    },
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
    },
    inline: {
        display: 'inline',
    },
    table: {
        minWidth: 350,
    },
    control: {
        padding: theme.spacing(1),
    },
    rootCard: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginTop: theme.spacing(5),
        marginBottom: 12,
        maxWidth: 350,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    button: {
        right: 0,
    },
    typography: {
        padding: theme.spacing(2),
    },
    popup: {
        padding: theme.spacing(2)
    },
    buttonPopup: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    sidemenu: {
        position: 'absolute',
        background: 'transparent',
        top: theme.spacing(1),
        right: theme.spacing(1),
        zIndex: 1101, //https://material-ui.com/customization/z-index/
    }
})
import React from "react";
import { StyleSheet } from 'react-native'

// Menu
const drawerWidth = 240;

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

export const useStyles =  () =>({
    root: {
        flexGrow: 1,
        marginBottom: 1
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

        margin: theme.spacing(1),
        width: 200,

    },
    content: {
        flexGrow: 1,
        overflow: 'hidden',
        maxWidth: 500,
        minWidth: 350,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    listRoot: {
        flexGrow: 1,
        overflow: 'hidden',
        marginLeft: 'auto',
        marginRight: 'auto'
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
    table: {
        minWidth: 350,
    },
    control: {
        padding: theme.spacing(1),
    },
    rootCard: {
        minWidth: 275,
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
        padding: theme.spacing(1),
        backgroundColor: 'white',
    },
    buttonPopup: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    },
    sidemenu: {
        // position: 'absolute',
        backgroundColor: 'transparent',
        zIndex: 1500, //https://material-ui.com/customization/z-index/
    },
    sidemenuIcon: {
        color: 'black'
    },
    rootMenu: {
        display: 'flex',
    },
    appBar: {
        backgroundColor: 'transparent',
        // transition: theme.transitions.create(['margin', 'width'], {
        //     easing: theme.transitions.easing.sharp,
        //     duration: theme.transitions.duration.leavingScreen,
        // }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        // transition: theme.transitions.create(['margin', 'width'], {
        //     easing: theme.transitions.easing.easeOut,
        //     duration: theme.transitions.duration.enteringScreen,
        // }),
    },
    menuButton: {
        marginRight: 0,
    },
    hide: {
        display: 'none',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1),
        justifyContent: 'flex-end',
    },
    titleMenu: {
        flexGrow: 1,
    },
    breadcrumbs: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1),
        justifyContent: 'flex-end',
    },
    contentMenu: {
        flexGrow: 1,

    }
})
import React from 'react';
import clsx from 'clsx';

//TODO Native Menu

import { Link } from '../atoms/Link'
import SideMenu from '../molecules/SideMenu'

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';


// Source: https://material-ui.com/components/drawers/#persistent-drawer

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        background: 'transparent',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 0,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    title : {
        flexGrow: 1,
    },
    breadcrumbs: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1),
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,

    },
}));


/**
 * 
 * @param {*} props 
 * @param {*} props.content any content to display (html, jsx, etc...) 
 * @param {Array} props.links list of links, first link will be home
 * @param {Boolean} props.breadcrumbs default `true` set `false` to hide
 */
export function MainMenu(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => setOpen(true);

    const handleDrawerClose = () => setOpen(false);

    const toggleDrawer = open => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(false)
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                elevation={0}
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        icon='menu'
                        accessibilityLabel="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    />
                    <Typography variant="h6" noWrap className={classes.title}>
                        {props.title}
                    </Typography>
                    {props.options ? <SideMenu options={props.options} /> : ''}

                </Toolbar>

            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="temporary"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {props.links.map((link, index) => (
                        <Link key={index} color='inherit' style={{ textDecoration: 'none' }} to={link.route}>
                            <ListItem button key={link.text}>
                            {props.icon ? <ListItemIcon> {props.icon}</ListItemIcon> : '' }
                                <ListItemText primary={link.text} />
                            </ListItem>
                        </Link>
                    ))}
                </List>
                <Divider />
            </Drawer>
            <main className={classes.content}>
                {/* <div className={classes.drawerHeader} /> */}
                {props.content}
            </main>
        </div>

    );
}
import React from 'react';
import clsx from 'clsx';

import Main from '../atoms/Main'
import { ListItem, ListHeader } from '../atoms/List';
import { AppBar } from '../atoms/AppBar';
import { Divider } from '../atoms/Divider';
import { IconButton } from '../atoms/IconButton';
import { DrawerIcon } from '../atoms/Icon.native';
import { useStyles } from '../../themes/DefaultTheme'
import { Modal, Portal, Surface } from 'react-native-paper';

import { View } from 'react-native'

function DrawerMenu(props) {
    const classes = useStyles();


    return (
        <View >
            <ListHeader className={classes.drawerHeader}>
                <IconButton onClick={props.close}>
                    <DrawerIcon />
                </IconButton>
            </ListHeader>
            <Divider />

            {props.links.map((link, index) => (
                <ListItem button
                    key={link.text + index}
                    title={link.text}
                    icon={props.icon ? props.icon : ''}
                    onClick={() => link.route} />
            ))}
            <Divider />
        </View>
    )
}

/**
 * 
 * @param {*} props 
 * @param {*} props.content any content to display (html, jsx, etc...) 
 * @param {Array} props.links list of links, first link will be home
 * @param {Boolean} props.breadcrumbs default `true` set `false` to hide
 */
export default function MainMenu(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);


    return (
        <Main >
            <Portal>
                {/* theme={{ colors: { backdrop: 'transparent' } }} */}
                <Modal visible={open} onDismiss={() => setOpen(!open)}>
                    <View style={{justifyContent: 'flex-end', flex: 2 }}>
                        <Surface>
                            <DrawerMenu links={props.links} close={() => setOpen(!open)} />
                        </Surface>
                    </View>
                </Modal>
            </Portal>
            <AppBar
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
                action={() => setOpen(!open)}
                actionIcon={'menu'}
                title={props.title}
            />
            <Main className={classes.contentMenu}>
                {props.content}
            </Main>
        </Main>


    );
}
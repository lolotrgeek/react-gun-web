import React, { useEffect } from 'react'

import { Link } from '../atoms/Link'
import { IconButton } from '../atoms/IconButton';
import { Menu, MenuItem } from '../atoms/Menu';
import { useStyles } from '../../themes/DefaultTheme';
import { MenuIcon } from '../atoms/Icon'
import Grid from '../atoms/Grid'
import { View, TouchableOpacity } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const debug = false

const ITEM_HEIGHT = 48;

/**
 * 
 * @param {*} props
 * @param {Array} props.options list of items `[{name, link, action}, ...]`
 * @param {*} props.selected default selected item in list
 *  
 */
export default function SideMenu(props) {
    const [show, setShow] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = useStyles();


    const handleClick = event => {
        console.log(event.nativeEvent)
        setShow(true);
        setAnchorEl({ x: event.nativeEvent.pageX, y: event.nativeEvent.pageY })
    };

    const handleClose = () => {
        setShow(false);
    };


    return (
        <View style={classes.sidemenu} >
            {debug && console.log(anchorEl)}
            <TouchableOpacity onPress={(event) => handleClick(event)} style={classes.sidemenuIcon} >
                <MenuIcon size={30} color='black' />
            </TouchableOpacity>

            <Menu
                anchor={anchorEl}
                keepMounted
                visible={show}
                onDismiss={handleClose}
                contentStyle={{
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: 200,
                }
                }
            >
                {Array.isArray(props.options) ? props.options.map(option => (
                    option.link ?
                        <Link to={option.link}>
                            <MenuItem key={option.name} onPress={() => {
                                handleClose()
                                if (option.action) return option.action()
                            }}>
                                {option.name}
                            </MenuItem>
                        </Link> :
                        <MenuItem key={option.name} onPress={() => {
                            handleClose()
                            if (option.action) return option.action()
                        }}>
                            {option.name}
                        </MenuItem>
                )) : null}
            </Menu>
        </View>
    );
}

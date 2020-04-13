import React, { useEffect } from 'react'

import { Link } from '../atoms/Link'
import { IconButton } from '../atoms/IconButton';
import { Menu, MenuItem } from '../atoms/Menu';
import { useStyles } from '../../themes/DefaultTheme';
import { MenuIcon } from '../atoms/Icon'
import Grid from '../atoms/Grid'
import { View } from 'react-native'

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
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };


    return (
        <View style={classes.sidemenu} onLayout={event => {setAnchorEl(event.nativeEvent.layout)}} >

            {debug && console.log(anchorEl)}
            <IconButton onPress={() => handleClick()} style={classes.sidemenuIcon} >
                <MenuIcon size={20} />
            </IconButton>

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

import React from 'react'

import { Link } from '../atoms/Link'

import {IconButton} from '../atoms/IconButton';
import {NativeIcon} from '../atoms/Icon';
import Menu from '@material-ui/core/Menu'; // TODO native Menu
import MenuItem from '@material-ui/core/MenuItem';
import { useStyles } from '../../themes/DefaultTheme';

const ITEM_HEIGHT = 48;

/**
 * 
 * @param {*} props
 * @param {Array} props.options list of items `[{name, link, action}, ...]`
 * @param {*} props.selected default selected item in list
 *  
 */
export default function SideMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const classes = useStyles();


    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className={classes.sidemenu}>
            <IconButton
                onClick={handleClick}
                style={{ color: 'white' }} // TODO set this to theme
            >
                <NativeIcon name='more_vert' />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: 200,
                    },
                }}
            >
                {Array.isArray(props.options) ? props.options.map(option => (
                    option.link ?
                        <Link to={option.link}>
                            <MenuItem key={option.name} onClick={() => {
                                handleClose()
                                if (option.action) return option.action()
                            }}>
                                {option.name}
                            </MenuItem>
                        </Link> :
                        <MenuItem key={option.name} onClick={() => {
                            handleClose()
                            if (option.action) return option.action()
                        }}>
                            {option.name}
                        </MenuItem>
                )) : ''}
            </Menu>
        </div>
    );
}

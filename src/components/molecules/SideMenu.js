import React from 'react'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from '../atoms/Link'

const ITEM_HEIGHT = 48;

const useStyles = makeStyles(theme => ({
    sidemenu: {
        position: 'absolute',
        background: 'transparent',
        top: theme.spacing(1),
        right: theme.spacing(1),
        zIndex: 1101, //https://material-ui.com/customization/z-index/
    }
}))

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
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
                style={{ color: 'white' }} // set this to theme
            >
                <MoreVertIcon />
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

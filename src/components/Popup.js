import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { PopupContext } from '../contexts/PopupContext'

const useStyles = makeStyles(theme => ({
    typography: {
        padding: theme.spacing(2),
    },
    popup: {
        padding: theme.spacing(2)
    },
    button: {
        margin: theme.spacing(2)
    }
}));

/**
 * 
 * @param {*} props 
 * @param {*} props.id 
 * @param {*} props.onAccept 
 * @param {*} props.onReject 
 * @param {*} props.onClose 
 * @param {*} props.isOpen 
 */
export default function Popup(props) {
    const classes = useStyles();
    let { state, dispatch } = useContext(PopupContext)
    const id = props.id ? props.id : ''
    let handleClose = () => dispatch({ type: "close" });
    return (
        <div>
            <Popover
                id={id}
                open={state}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <div className={classes.popup}>
                    <Typography className={classes.typography}> The content of the Popover. </Typography>
                    <Button classname={classes.button} aria-describedby={id} variant="contained" color="primary" onClick={props.onAccept} > Accept </Button>
                    <Button classname={classes.button} aria-describedby={id} variant="contained" color="secondary" onClick={props.onReject} > Reject </Button>
                </div>
            </Popover>
        </div >
    );
}

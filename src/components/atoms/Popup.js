import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '../atoms/Grid'
import { PopupContext } from '../../contexts/PopupContext'

const useStyles = makeStyles(theme => ({
    typography: {
        padding: theme.spacing(2),
    },
    popup: {
        padding: theme.spacing(2)
    },
    button: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2)
    }
}));

/**
 * 
 * @param {*} props 
 * @param {*} props.id 
 * @param {*} props.content 
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
                    vertical: "top",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <div className={classes.popup}>
                    <Typography className={classes.typography}>{props.content}</Typography>
                    <Grid container direction='row' justify='space-evenly' alignItems='flex-start' >
                        <Grid className={classes.button} item >
                            <Button aria-describedby={id} variant="contained" color="primary" onClick={props.onAccept} > Accept </Button>
                        </Grid>
                        <Grid className={classes.button} item >
                            <Button aria-describedby={id} variant="contained" color="secondary" onClick={props.onReject} > Reject </Button>
                        </Grid>



                    </Grid>

                </div>
            </Popover>
        </div >
    );
}

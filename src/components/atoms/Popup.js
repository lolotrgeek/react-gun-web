import React, { useContext } from 'react';
import { Modal, Portal } from 'react-native-paper'

import Typography from '../atoms/Typography';
import { Button } from '../atoms/Button';
import Grid from '../atoms/Grid'
import { PopupContext } from '../../contexts/PopupContext'
import { useStyles } from '../../themes/DefaultTheme'
import { View } from 'react-native'

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
    let handleClose = () => dispatch({ type: "close" });
    return (
        <Portal>
            <Modal visible={state} style={classes.modal} onDismiss={handleClose}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    ...classes.spaceFull
                }}>
                    <Typography variant='h6' className={classes.typography}>{props.content}</Typography>
                    <Grid className={classes.buttonPopup} item >
                        <Button variant="contained" color="primary" onPress={props.onAccept} > Accept </Button>
                    </Grid>
                    <Grid className={classes.buttonPopup} item >
                        <Button variant="contained" color="secondary" onPress={props.onReject} > Reject </Button>
                    </Grid>
                </View>
            </Modal>
        </Portal >

    );
}

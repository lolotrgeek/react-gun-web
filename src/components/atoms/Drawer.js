import React from 'react'
import { Modal, Portal, Text, Button, Provider } from 'react-native-paper';
/**
 * 
 * @param {*} props 
 * @param {*} props.visible 
 * @param {*} props.onClose 
 */
export const Drawer = props => (
    <Provider>
        <Portal>
            <Modal visible={props.visible} onDismiss={props.onClose}>
                <Text>Example Modal</Text>
            </Modal>
        </Portal>
    </Provider>
)




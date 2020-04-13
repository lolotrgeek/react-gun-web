import React from 'react'
import { Appbar as PaperAppbar } from 'react-native-paper';

const debug= false

const actionHandler = (props) => {
    if(props.action === 'back') return (             
    <PaperAppbar.BackAction
        onPress={() => props.backAction}
    />)
}

/**
 * @param {*} props 
 * @param {*} props.title 
 * @param {*} props.subtitle 
 *  
 */
export const AppBar = props => (
    <PaperAppbar.Header>
        {props.children}
        {props.action ?
            <PaperAppbar.Action icon="menu" onPress={() => {debug && console.log('Doing Action...'); props.action()}} />
            : null
        }
        <PaperAppbar.Content
            title={props.title}
            subtitle={props.subtitle}
        />

        {props.sideMenu ?
            <PaperAppbar.Action icon="dots-vertical" onPress={props.sideMenu} />
            : null
        }
    </PaperAppbar.Header>
);
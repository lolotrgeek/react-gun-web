import React from 'react'
import { Menu as PaperMenu } from 'react-native-paper';


/**
 * https://callstack.github.io/react-native-paper/menu.html
 * @param {*} props 
 */
export const Menu = props => (
    <PaperMenu {...props}
        visible={props.visible ? props.visible : false}
        // anchor={props.anchor ? props.anchor : {x:0, y: 0}}
        onDismiss={() => props.onDismiss()}
        children={props.children}
    />)

/**
 * https://callstack.github.io/react-native-paper/menu-item.html
 * @param {*} props 
 */
export const MenuItem = props => (
    <PaperMenu.Item {...props}
        title={props.title || props.children}
        icon={props.icon}
        onPress={props.onPress}
    />)

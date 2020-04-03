import React from 'react'
import { List as PaperList } from 'react-native-paper';

/**
 * https://callstack.github.io/react-native-paper/list-item.html
 * @param {*} props 
 * @param {*} props.title 
 * @param {*} props.onClick 
 * @param {*} props.icon
 *  
 */
export const ListItem = props => (
    <PaperList.Item {...props}
        title={props.title}
        description={props.children}
        onPress={props.onClick}
        left={() => <PaperList.Icon icon={props.icon} />}
    />
);
/**
 * https://callstack.github.io/react-native-paper/list-icon.html
 * @param {*} props 
 */
export const ListIcon = props => <PaperList.Icon {...props} icon={props.icon} />;

/**
 * https://callstack.github.io/react-native-paper/list-section.html
 * @param {*} props 
 */
export const ListSection = props => <PaperList.Section {...props} children={props.children}/>;
/**
 * https://callstack.github.io/react-native-paper/list-subheader.html
 * @param {*} props 
 */
export const ListHeader = props => <PaperList.Subheader {...props} children={props.children}/>;
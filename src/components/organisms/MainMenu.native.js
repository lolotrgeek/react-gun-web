import React from 'react';
import clsx from 'clsx';

import Main from '../atoms/Main'
import { ListItem, ListHeader } from '../atoms/List';
import { AppBar } from '../atoms/AppBar';
import { Divider } from '../atoms/Divider';
import { useStyles } from '../../themes/DefaultTheme'

import RBSheet from "react-native-raw-bottom-sheet";
import { View, Button } from 'react-native'
import { useHistory } from 'react-router-native'


/**
 * 
 * @param {*} props 
 * @param {*} props.content any content to display (html, jsx, etc...) 
 * @param {Array} props.links list of links, first link will be home
 * @param {Boolean} props.breadcrumbs default `true` set `false` to hide
 */
export default function MainMenu(props) {
    const history = useHistory()
    const refRBSheet = React.useRef();
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {props.children}
            <Button title="OPEN BOTTOM SHEET" onPress={() => refRBSheet.current.open()} />
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={340}
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent"
                    },
                    draggableIcon: {
                        backgroundColor: "#000"
                    }
                }}
            >
                <View>
                    {props.links.map((link, index) => (
                        <View key={link.text + index} >
                            <ListItem button
                                title={link.text}
                                onClick={() => history.push(link.route)}
                            />
                            <Divider />
                        </View>
                    ))
                    }
                </View>
            </RBSheet>
        </View>
    );
}
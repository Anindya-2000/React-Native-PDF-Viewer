import React, { useEffect, useState, useRef } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NavBar = (props) => {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const {showSortingModal, navigation} = props;
 
    return (
        <Appbar.Header>
            <Appbar.Content title="PDF Viewer" titleStyle = {{fontSize: 17}}/>
            <Appbar.Action icon="magnify" onPress={() => navigation.navigate('Search')} />
            <Appbar.Action icon="sort-variant" onPress={() => {showSortingModal();}} />
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <Appbar.Action icon="dots-vertical" color="white" onPress={openMenu} />
            }>
                <Menu.Item onPress={() => {console.log('Option 1 was pressed')}} title="Option 1" />
                <Menu.Item onPress={() => {console.log('Option 2 was pressed')}} title="Option 2" />
                <Menu.Item onPress={() => {console.log('Option 3 was pressed')}} title="Option 3" disabled />
            </Menu>
        </Appbar.Header>
    )
};

export default NavBar;
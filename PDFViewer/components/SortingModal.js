import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Portal, Modal, RadioButton, withTheme, Button as PaperBtn, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SORT_VARIANT_ARR = [  'Sort By Name',
                            'Sort By Size',
                        ];

const SortingModal = (props) => {
    const {visible, hideModal, theme, sortPdfs, sortVariant, _order} = props;
    const [type, setType] = useState(0);
    const [order, setOrder] = useState(-1);
    useEffect(() => {
        setType(sortVariant);
        setOrder(_order);
    }, [])
    return (
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.ModalStyle}>
                <RadioButton.Group onValueChange={newValue => setType(newValue)} value={type}>
                    {SORT_VARIANT_ARR.map((val, index) => (
                        <View style = {styles.radioWrapper} key = {index}>
                            <RadioButton value = {index} color = {theme.colors.primary}/>
                            <Text>{val}</Text>
                        </View>
                    ))}               
                </RadioButton.Group>
                <Divider/>
                <RadioButton.Group onValueChange={newValue => setOrder(newValue)} value={order}>
                    <View style = {styles.radioWrapper}>
                        <RadioButton value = {-1} color = {theme.colors.primary}/>
                        <Text>Ascending Order</Text>
                    </View>
                    <View style = {styles.radioWrapper}>
                        <RadioButton value = {1} color = {theme.colors.primary}/>
                        <Text>Descending Order</Text>
                    </View>        
                </RadioButton.Group>
                <PaperBtn 
                icon = {() => <MaterialCommunityIcons icon = "sort" color = {theme.colors.primary} size= {20} />}
                mode = "contained" 
                onPress = {() => {sortPdfs(type, order); hideModal()}} 
                style = {{width: 100, alignSelf: 'center', marginTop: 20}}>Sort</PaperBtn>
            </Modal>
        </Portal>
    )
}

const styles = StyleSheet.create({
    ModalStyle: {
        backgroundColor: 'white',
        borderRadius:5,
        width: 300,
        padding: 20,
        alignSelf: 'center',
    },
    radioWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})

export default withTheme(SortingModal);
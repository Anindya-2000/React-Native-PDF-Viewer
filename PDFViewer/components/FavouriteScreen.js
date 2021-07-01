import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  InteractionManager,
  Dimensions,
  StatusBar
} from 'react-native';
import { withTheme } from 'react-native-paper';
import SortingModal from './SortingModal';
import NavBar from './NavBar';
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import { SortingFunction } from './utils';
import BottomSlider from './BottomSlider';
import ConfirmationModal from './ConfirmationModal';
import { usePdfContext } from './Context';
import PdfItem from './PdfItem';
import RenameModal from './RenameModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import DirectoryBrowser from './DirectoryBrowser';
import ListView from './ListView';

const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2
};

const FavouriteScreen = ({navigation, route, theme}) => {
    const {favPdfs, setFavPdfs, getFavPdfs} = usePdfContext();
    let { width } = Dimensions.get("window");
    const [selectedPdf, setSelectedPdf] = useState(null);

    const [sortVariant, setSortVariant] = useState(0);
    const [order, setOrder] = useState(-1);

    // Sorting Modal
    const [sortingModalVisible, setSortingModalVisible] = React.useState(false);
    const showSortingModal = () => setSortingModalVisible(true);
    const hideSortingModal = () => setSortingModalVisible(false);

    // Copy or Cut operation
    const [op, setOp] = useState(0);

    // Bottom Slider
    const [isBottomSliderVisible, setIsBottomSliderVisible] = useState(false);
    const showBottomSlider = (item) => {
        setSelectedPdf(item);
        setIsBottomSliderVisible(true);
        
    }
    const hideBottomSlider = () => {
        setIsBottomSliderVisible(false);
        
    };
    
    // Confirmation Modal
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const showDeleteModal = () => {
        hideBottomSlider();
        setIsDeleteModalVisible(true)
    };

    const hideDeleteModal = () => setIsDeleteModalVisible(false);

    // Rename Modal
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const openRenameModal = () => {
        hideBottomSlider();
        setRenameModalOpen(true)
    }
    const closeRenameModal = () => setRenameModalOpen(false);
    
    const sortPdfs = (sort_type, _order = -1) => {
        setSortVariant(sort_type);
        setOrder(_order);
        SortingFunction(setAllPdfs, sort_type, _order);
    }

    // Directory Browser Modal
    const [browserModalOpen, setBrowserModalOpen] = useState(false);
    const openBrowserModal = (val) => {
        setOp(val);
        setBrowserModalOpen(true)
    }
    const closeBrowserModal = () => setBrowserModalOpen(false);

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            /* 2: Component is done animating */
            setTimeout(() => {
                getFavPdfs(setFavPdfs);
            }, 50)
        });     
    }, [])


    return (
        favPdfs._data.length === 0 ? 
        <SafeAreaView style={styles.container}>
            <StatusBar
            barStyle="light-content"
            backgroundColor="#694fad"/>
            <NavBar showSortingModal = {showSortingModal} navigation = {navigation}/>
        </SafeAreaView> :
        <SafeAreaView style={styles.container}>
            <StatusBar
            barStyle="light-content"
            backgroundColor="#694fad"/>
            <NavBar showSortingModal = {showSortingModal} navigation = {navigation}/>
            <SortingModal 
            visible = {sortingModalVisible} 
            hideModal = {hideSortingModal} 
            theme = {theme} 
            sortPdfs = {sortPdfs}
            sortVariant = {sortVariant}
            setSortVariant = {setSortVariant}
            order = {order}
            />
            <ConfirmationModal
            visible = {isDeleteModalVisible}
            hideModal = {hideDeleteModal}
            selectedPdf = {selectedPdf}
            />
            {
                renameModalOpen &&
                <RenameModal
                visible = {renameModalOpen}
                hideModal = {closeRenameModal}
                selectedPdf = {selectedPdf}
                theme = {theme}
                />
            }
 
            <ListView
            data = {favPdfs}
            theme = {theme}
            navigation = {navigation}
            showBottomSlider = {showBottomSlider}
            />
            { isBottomSliderVisible && <BottomSlider openBrowserModal = {openBrowserModal} openRenameModal = {openRenameModal} showDeleteModal = {showDeleteModal} theme={theme} visible = {isBottomSliderVisible} hideModal = {hideBottomSlider} selectedPdf = {selectedPdf}/>}
            <DirectoryBrowser
            selectedPdf = {selectedPdf}
            op = {op}
            visible = {browserModalOpen}
            hideModal = {closeBrowserModal}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
});

export default withTheme(FavouriteScreen);
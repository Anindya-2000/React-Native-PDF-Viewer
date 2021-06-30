import React from 'react';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  InteractionManager,
  Dimensions
} from 'react-native';
import { withTheme } from 'react-native-paper';
import NavBar from './NavBar';
import SortingModal from './SortingModal';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { SortingFunction } from './utils';
import BottomSlider from './BottomSlider';
import ConfirmationModal from './ConfirmationModal';
import { usePdfContext } from './Context';
import PdfItem from './PdfItem';
import RenameModal from './RenameModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import DirectoryBrowser from './DirectoryBrowser';


const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2
};

const RecentScreen = ({navigation, theme}) => {
    const {recentPdfs, setRecentPdfs, getRecentPdfs } = usePdfContext();
    let { width } = Dimensions.get("window");

    const [sortVariant, setSortVariant] = useState(0);
    const [order, setOrder] = useState(-1);
    
    const [selectedPdf, setSelectedPdf] = useState(null);

    // Copy or Cut operation
    const [op, setOp] = useState(0);

    // Sorting Modal
    const [sortingModalVisible, setSortingModalVisible] = React.useState(false);
    const showSortingModal = () => setSortingModalVisible(true);
    const hideSortingModal = () => setSortingModalVisible(false);

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

    const sortPdfs = (sort_type, _order = -1) => {
        setSortVariant(sort_type);
        setOrder(_order);
        SortingFunction(setAllPdfs, sort_type, _order);
    }

    // Rename Modal
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const openRenameModal = () => {
        hideBottomSlider();
        setTimeout(() => {
            setRenameModalOpen(true)
        }, 50)
        
    }
    const closeRenameModal = () => setRenameModalOpen(false);

    // Directory Browser Modal
    const [browserModalOpen, setBrowserModalOpen] = useState(false);
    const openBrowserModal = (val) => {
        setOp(val);
        setBrowserModalOpen(true)
    }
    const closeBrowserModal = () => setBrowserModalOpen(false);

    // Recycler View Stuffs
    let _layoutProvider = new LayoutProvider(
        index => {
            return ViewTypes.FULL;
        },
        (type, dim) => {
            dim.width = width;
            dim.height = 73;
        }
    );

    //Since component should always render once data has changed, make data provider part of the state

    let _rowRenderer = (type, data) => {
        //You can return any view here, CellContainer has no special significance
        return <PdfItem item = {data} theme = {theme} showBottomSlider = {showBottomSlider} navigation = {navigation}/>
    }

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            /* 2: Component is done animating */
            //  Get storage permission for the first time
            getRecentPdfs(setRecentPdfs);
        });
    }, []) 

    return (
        recentPdfs._data.length === 0 ? 
        <SafeAreaView style={styles.container}>
            <NavBar showSortingModal = {showSortingModal} navigation = {navigation}/>
        </SafeAreaView> :
        <SafeAreaView style={styles.container}>
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
            <RecyclerListView 
            layoutProvider={_layoutProvider} 
            dataProvider={recentPdfs} 
            rowRenderer={_rowRenderer}
            />
            
            { isBottomSliderVisible && <BottomSlider openBrowserModal = {openBrowserModal} showDeleteModal = {showDeleteModal} theme={theme} visible = {isBottomSliderVisible} hideModal = {hideBottomSlider} selectedPdf = {selectedPdf} openRenameModal = {openRenameModal}/>}
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
    },
    pdfTabs: {
        // borderBottomWidth: 0.5,
    },
    header: {
        fontSize: 32,
        backgroundColor: "#fff"
    },
});

export default withTheme(RecentScreen);
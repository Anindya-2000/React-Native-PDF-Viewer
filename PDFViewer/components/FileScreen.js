import React, {PureComponent, useRef} from 'react';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  InteractionManager,
  Dimensions, 
  StatusBar
} from 'react-native';
import { withTheme } from 'react-native-paper';
import NavBar from './NavBar';
import SortingModal from './SortingModal';
import BottomSlider from './BottomSlider';
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import ConfirmationModal from './ConfirmationModal';
import {SortingFunction} from './utils';
import { usePdfContext } from './Context';
import PdfItem from './PdfItem';
import RenameModal from './RenameModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PermissionsAndroid } from 'react-native'
import DirectoryBrowser from './DirectoryBrowser';
import FileLoader from './FileLoader';

const ViewTypes = {
    FULL: 0,
    HALF_LEFT: 1,
    HALF_RIGHT: 2
};


const FileScreen = ({navigation, theme}) => {
    const {allPdfs, setAllPdfs, findPDFs} = usePdfContext();
    let { width } = Dimensions.get("window");
    let [loaderHeight, setLoaderHeight] = useState(0);

    // Current sort variant
    const [sortVariant, setSortVariant] = useState(0);
    const [order, setOrder] = useState(-1);

    // Selected PDF
    const [selectedPdf, setSelectedPdf] = useState(null);

    // Sorting Modal
    const [sortingModalVisible, setSortingModalVisible] = useState(false);
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

    // Directory Browser Modal
    const [browserModalOpen, setBrowserModalOpen] = useState(false);
    const openBrowserModal = (val) => {
        setOp(val);
        setBrowserModalOpen(true)
    }
    const closeBrowserModal = () => setBrowserModalOpen(false);

    const requestExternalStoreageRead = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    'title': 'PDF Viewer',
                    'message': 'App needs access to external storage'
                }
            );
    
            return granted == PermissionsAndroid.RESULTS.GRANTED
        } 
        catch (err) {
        //Handle this error
            console.log(err.message);
        }
    }

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            /* 2: Component is done animating */
            const getPdfsWithPermission = async () => {
                let isGranted = await requestExternalStoreageRead();
                if(isGranted) {
                    await findPDFs(setAllPdfs);
                }
            }
            getPdfsWithPermission();  
        });
        
    }, []);

    const sortPdfs = (sort_type, _order = -1) => {
        setSortVariant(sort_type);
        setOrder(_order);
        SortingFunction(setAllPdfs, sort_type, _order);
    }
    
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

    return (
        allPdfs._data.length === 0 ? 
        <SafeAreaView style={styles.container}>
            <StatusBar
            barStyle="light-content"
            backgroundColor="#694fad"/>
            <NavBar showSortingModal = {showSortingModal} navigation = {navigation}/>
            <View style = {{flex: 1}}>
                <FileLoader/>
            </View>
        </SafeAreaView> :
        <SafeAreaView style = {{flex: 1}}>
        <SafeAreaView style={styles.container} >
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
            _order = {order}
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
            dataProvider={allPdfs} 
            rowRenderer={_rowRenderer}
            useWindowScroll
            />
            { isBottomSliderVisible && <BottomSlider openBrowserModal = {openBrowserModal} openRenameModal = {openRenameModal} showDeleteModal = {showDeleteModal} theme={theme} visible = {isBottomSliderVisible} hideModal = {hideBottomSlider} selectedPdf = {selectedPdf}/>}
            <DirectoryBrowser
            selectedPdf = {selectedPdf}
            op = {op}
            visible = {browserModalOpen}
            hideModal = {closeBrowserModal}
            />
        </SafeAreaView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        fontSize: 32,
        backgroundColor: "#fff"
    },
});

export default withTheme(FileScreen);
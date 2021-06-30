import Realm, { User } from "realm";
import PdfSchema from "../schemas/PdfSchema";
import UserData from "../schemas/UserData";

const schema = [PdfSchema, UserData]

const MONTHS = [
    'Jan','Feb','Mar','Apr',
    'May','Jun','Jul','Aug',
    'Sep','Oct','Nov','Dec'
];

export const SortingFunction = (setHook, sortType, order) => {
    console.log(sortType);
    switch(sortType) {
        // Sort by name
        case 0:
            Realm.open({
                path: 'myrealm',
                schema: schema
            }).then(realm => {
                const sortedList = realm.objects('Pdf').sorted('name', order == -1 ? false: true);
                setHook(prev => prev.cloneWithRows(sortedList));
            })
            break;
        // Sort By Size
        case 1:
            Realm.open({
                path: 'myrealm',
                schema: schema
            }).then(realm => {
                const sortedList = realm.objects('Pdf').sorted('size', order == -1 ? false: true);
                setHook(prev => prev.cloneWithRows(sortedList));
            })
            break;
    }
}

export const getPath = (path) => {
    let filePath = path.split('/');
    if(filePath.length >= 5)
        filePath = filePath[4];
    else
        filePath = path;
    return filePath;
}

export const getSize = (size) => {
    let sz = Number(size);
    let unit = 'Byte';
    if(sz > 1024) {
        sz = sz / 1024;
        unit = 'KB';
    }
    
    if(sz > 1024) {
        sz = sz / 1024;
        unit = 'MB';
    }

    if(sz > 1024) {
        sz = sz / 1024;
        unit = 'GB';
    }

    sz = sz.toFixed(1);
    return sz.toString() + ' ' + unit;
}

export const getCreationDate = (date) => {
    date = new Date(date);
    return MONTHS[date.getMonth()] + ' ' + date.getDate() + ',' + ' ' + date.getFullYear();
}
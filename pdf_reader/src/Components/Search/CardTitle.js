import { useContext } from 'react';

import s from './CardTitle.module.scss';

import UploadContext from '../../context/upload-context';

const CardTitle = () => {
    let { isUploaded, isSelected } = useContext(UploadContext);
    let title = <h2>Step 1: Upload File</h2>;

    if(isUploaded && !isSelected) {
        title = <h2>Step 2: Select File</h2>;
    } else if(isSelected) {
        title = <h2>Step 3: Search PDF</h2>;
    }

    return title;
}

export default CardTitle;

import { useReducer } from "react";

import UploadContext from "./upload-context";

const defaultUploadState = {
    file: null,
    isUploaded: false,
    isError: false,
    isSelected: false,
};

const uploadReducer = (state, action) => {
    if(action.type === 'SET_FILE') {
        return {
            ...state,
            file: action.val,
        };
    }

    if (action.type === 'SET_IS_UPLOADED') {
        return {
            ...state,
            isUploaded: action.val,
        };
    }

    if (action.type === 'SET_IS_ERROR') {
        return {
            ...state,
            isError: action.val,
        };
    }

    if (action.type === 'SET_IS_SELECTED') {
        return {
            ...state,
            isSelected: action.val,
        };
    }

    return defaultUploadState;
};

const UploadProvider = ({ children }) => {
    let [uploadState, dispatchUploadAction] = useReducer(uploadReducer, defaultUploadState);

    const fileHandler = file => dispatchUploadAction({ type: 'SET_FILE', val: file });
    const fileUploadHandler = bool => dispatchUploadAction({ type: 'SET_IS_UPLOADED', val: bool });
    const fileErrorHandler = bool => dispatchUploadAction({ type: 'SET_IS_ERROR', val: bool });
    const fileSelectHandler = bool => dispatchUploadAction({ type: 'SET_IS_SELECTED', val: bool });


    let uploadContext = {
        file: uploadState.file,
        isUploaded: uploadState.isUploaded,
        isError: uploadState.isError,
        isSelected: uploadState.isSelected,
        setFile: fileHandler,
        setIsUploaded: fileUploadHandler,
        setIsError: fileErrorHandler,
        setIsSelected: fileSelectHandler,
    };

    return (
        <UploadContext.Provider value={uploadContext}>
            {children}
        </UploadContext.Provider>
    );
};

export default UploadProvider;
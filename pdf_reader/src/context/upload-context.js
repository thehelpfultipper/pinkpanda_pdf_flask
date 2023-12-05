import React from "react";

const UploadContext = React.createContext({
    file: '',
    setFile: () => {},
    isUploaded: false,
    setIsUploaded: () => {},
    isError: false,
    setIsError: () => {},
    isSelected: false,
    setIsSelected: () => {},
});

export default UploadContext;
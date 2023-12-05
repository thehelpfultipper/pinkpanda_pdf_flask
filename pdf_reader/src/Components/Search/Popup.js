
import { useState, useRef} from 'react';
import {createPortal} from 'react-dom';

import s from './Popup.module.scss';

const PopupContent = ({url, onClose}) => {
    const [zoom, setZoom] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clickThreshold, setClickThreshold] = useState(1);

    let initialX = useRef(0),
        initialY = useRef(0),
        currentX = useRef(0),
        currentY = useRef(0);

    const handleZoomToggle = () => {
        if(!isDragging && clickThreshold !== 0) {
            setZoom(!zoom);
            setPosition({ x: 0, y: 0 });
        } else {
            setClickThreshold(1);
        }
    }

    const handleStartDrag = (e) => {
        if(zoom) {
            setIsDragging(true);

            initialX.current = e.clientX;
            initialY.current = e.clientY;

            e.preventDefault();
        }
    };

    const handleEndDrag = () => {
         isDragging && setIsDragging(false);

    }

    const handleDrag = (e) => {
        if (!isDragging) return;
        currentX.current = e.clientX;
        currentY.current = e.clientY;
        const deltaX = currentX.current - initialX.current;
        const deltaY = currentY.current - initialY.current;

        setPosition({ x: position.x + deltaX, y: position.y + deltaY });
        initialX.current = e.clientX;
        initialY.current = e.clientY;

    };

    const handleMouseMove = () => {
        if(isDragging) {
            setClickThreshold(0);
        }
    }


    const closePopupHandler = () => {
        onClose();
    }

    const imgStyle = {
        transform: `translate(${position.x}px, ${position.y}px) ${zoom ? 'scale(1.5)' : 'scale(1)'}`,
        cursor: zoom ? (isDragging ? 'move' : 'zoom-out') : 'zoom-in'
    };
    return (
        <div className={s.popup}>
            <span className={s.close} onClick={closePopupHandler}>&times;</span>
            <img 
                className={`${s.popup_content}`}
                style={imgStyle}
                src={url}
                alt="Expanded Image" 
                onClick={handleZoomToggle}
                onMouseDown={handleStartDrag}
                onMouseUp={handleEndDrag}
                onMouseMove={handleDrag}
                onMouseMoveCapture={handleMouseMove}
            />
        </div>
    )
}

const Popup = ({url, onClose}) => {
    return createPortal(
        <PopupContent url={url} onClose={onClose} />,
        document.getElementById('overlays')
    );
}


export default Popup;
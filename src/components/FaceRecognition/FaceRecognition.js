import React from 'react';

const FaceRecognition = ({ imageUrls, boxes }) => {
    const renderBoxes = () => {
        return boxes.map((box, index) => {
            const boxStyle = {
                top: box.topRow + 'px',
                right: box.rightCol + 'px',
                bottom: box.bottomRow + 'px',
                left: box.leftCol + 'px',
                position: 'absolute',
                boxShadow: '0 0 0 3px #fe0303 inset',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                cursor: 'pointer',
                width: box.rightCol - box.leftCol + 'px',
                height: box.bottomRow - box.topRow + 'px',
            };

            return (
                <div
                    key={index}
                    style={boxStyle}
                ></div>
            );
        });
    };

    const renderImages = () => {
        return imageUrls.map((imageUrl, index) => {
            return (
                <div key={index}>
                    <h1>Image #{index}</h1>
                    <img key={index} id='inputimage' alt='' src={imageUrl} width='700px' height='auto'></img>
                </div>
            )
        })
    }

    return (
        <div className='center ma'>
            <div className="absolute mt2">
                {renderImages()}
                {/* <img id='inputimage' alt='' src={imageUrls[0]} width='700px' height='auto'></img> */}
                {renderBoxes()}
            </div>
        </div>
    );
}

export default FaceRecognition;
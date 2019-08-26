import React from 'react';

const FaceRecon = ({imageUrl}) => {
    return(
        <div className='center ma'>
            <div className='absolute mt2'>
                <img alt="" src={imageUrl} width='500px' height='auto'></img>
            </div>
        </div>
    );
}
export default FaceRecon;
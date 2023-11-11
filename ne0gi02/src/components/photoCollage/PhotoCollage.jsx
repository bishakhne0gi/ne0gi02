import React from 'react'
import './photoCollage.css'


const PhotoCollage = ({ images }) => {
    return (
        <>
            <div className="photo-collage">
                {images.map((image, index) => (
                    <div key={index} className="photo-collage-item">
                        <img src={image} alt={`Photo ${index + 1}`} />
                    </div>
                ))}
            </div>
        </>
    )
}

export default PhotoCollage
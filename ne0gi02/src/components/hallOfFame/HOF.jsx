import React from 'react'
import './hof.css'
import PhotoCollage from '../photoCollage/PhotoCollage';
import Bugbyte from '../../assets/bugbyte.png'
import PhotoAlbum from "react-photo-album";
const HOF = () => {



    const photos = [
        {
            src: Bugbyte,
            width: 800,
            height: 600
        },
        {
            src: Bugbyte,
            width: 1600,
            height: 900
        },
        {
            src: Bugbyte,
            width: 800,
            height: 600
        }
    ];

    return (
        <>
            <div className="hof__container section__padding">
                <div className="header">
                    Hall Of Fame
                </div>
                <div className="section__padding">

                    <PhotoAlbum layout="rows" photos={photos} />
                </div>
            </div>
        </>
    )
}

export default HOF
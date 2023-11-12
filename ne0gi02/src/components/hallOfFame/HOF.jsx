import React from 'react'
import './hof.css'
import one from '../../assets/hof/1.jpg'
import two from '../../assets/hof/2.jpg'
import three from '../../assets/hof/3.jpg'
import four from '../../assets/hof/4.jpg'
import five from '../../assets/hof/5.jpg'
import six from '../../assets/hof/6.jpg'
import sev from '../../assets/hof/7.jpg'
import eight from '../../assets/hof/8.jpg'
import nine from '../../assets/hof/9.jpg'
import PhotoAlbum from "react-photo-album";
const HOF = () => {



    const photos = [
        {
            src: one,
            width: 800,
            height: 600
        },
        {
            src: five,
            width: 800,
            height: 600
        },
        {
            src: three,
            width: 800,
            height: 600
        }
    ];
    const photos2 = [
        {
            src: four,
            width: 900,
            height: 1000
        },
        {
            src: two,
            width: 1600,
            height: 1000
        },
        {
            src: six,
            width: 600,
            height: 600
        }
    ];
    const photos3 = [
        {
            src: sev,
            width: 800,
            height: 600
        },
        {
            src: eight,
            width: 800,
            height: 600
        },
        {
            src: nine,
            width: 800,
            height: 600
        }
    ];

    return (
        <>
            <div className="hof__container section__padding">
                <div className="header hof_title">
                    Hall Of Fame
                </div>
                <div className="section__padding">
                    <div className='album_marg'>

                        <PhotoAlbum layout="rows" photos={photos} />
                    </div>
                    <div className='album_marg'>

                        <PhotoAlbum layout="rows" photos={photos2} />
                    </div>
                    <div className='album_marg'>

                        <PhotoAlbum layout="rows" photos={photos3} />
                    </div>


                </div>
            </div>
        </>
    )
}

export default HOF
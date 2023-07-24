import React, { useState } from 'react'
import './picture.css'
import Profile from '../../assets/bisakhpng.png'

const Picture = () => {

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };





    return (
        <>
            <div className='picture_container section__padding'>
                <div className="avatar">
                    <img src={Profile} onClick={toggleVisibility} data-aos="fade-right" data-aos-easing="linear" data-aos-duration="1000" das-aos-offset="300"></img>


                    <div className="picture_txt">
                        <div className="click">
                            Click on Me
                        </div>
                        {isVisible &&
                            <div className="show">
                                Welcome to my portfolio
                            </div>
                        }

                    </div>

                </div>
            </div>
        </>
    )
}

export default Picture
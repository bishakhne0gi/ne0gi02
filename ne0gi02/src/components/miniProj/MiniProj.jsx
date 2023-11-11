import React, { useRef, useEffect } from 'react'
import './miniProj.css'
import ok from '../../assets/bugbyte.png'

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Pagination, Navigation } from 'swiper/modules';

const MiniProj = () => {





    return (
        <>
            <div className="miniProj__container section__padding">
                <div className="header">
                    Mini Projects
                </div>
                <div className="swiper__container section__padding">
                    <Swiper
                        slidesPerView={1}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Pagination]}
                        className="mini"
                    >
                        <SwiperSlide>
                            <div className="slider__container">
                                <div className="title">
                                    EMOTION DETECTER
                                </div>
                                <div className="btn_container">

                                    <button className='btn github marg' onClick={() => {
                                        window.location.href = 'https://github.com/bishakhne0gi/emotion_detecter';
                                    }}>
                                        Github
                                    </button>
                                    <button className='btn github marg' onClick={() => {
                                        window.location.href = 'https://getemotions.netlify.app/';
                                    }}>
                                        Live
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="slider__container2">
                                <div className="title">
                                    URL SHORTENER
                                </div>
                                <div className="btn_container">

                                    <button className='btn github marg' onClick={() => {
                                        window.location.href = 'https://github.com/bishakhne0gi/urlshortener';
                                    }}>
                                        Github
                                    </button>
                                    <button className='btn github marg' onClick={() => {
                                        window.location.href = 'https://url-shrinker22.herokuapp.com/';
                                    }}>
                                        Live
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="slider__container">
                                <div className="title">
                                    Dashboard UI
                                </div>
                                <div className="btn_container">

                                    <button className='btn github marg' onClick={() => {
                                        window.location.href = 'https://github.com/bishakhne0gi/DashboardUI';
                                    }}>
                                        Github
                                    </button>
                                    <button className='btn github marg' onClick={() => {
                                        window.location.href = 'https://dashboardclone1.netlify.app/';
                                    }}>
                                        Live
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="slider__container2">
                                <div className="title">
                                    ENVELOPE
                                </div>
                                <div className="btn_container">

                                    <button className='btn github marg' onClick={() => {
                                        window.location.href = 'https://github.com/bishakhne0gi/envelop-animation';
                                    }}>
                                        Github
                                    </button>
                                    <button className='btn github marg' onClick={() => {
                                        window.location.href = 'https://enevelope-animation.netlify.app/';
                                    }}>
                                        Live
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>

                    </Swiper>
                </div>
            </div>
        </>
    )
}

export default MiniProj
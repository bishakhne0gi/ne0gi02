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
                                    1. EMOTION DETECTER
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
                                    2. SPRING CRUD
                                </div>
                                <div className="btn_container">

                                    <button className='btn github marg' onClick={() => {
                                        window.location.href = 'https://github.com/bishakhne0gi/Spring-Crud';
                                    }}>
                                        Github
                                    </button>
                                    <button className='btn github marg' onClick={() => {
                                        window.location.href = 'https://github.com/bishakhne0gi/Spring-Crud';
                                    }}>
                                        Live
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="slider__container">
                                <div className="title">
                                    3. FOOD-N-FUN
                                </div>
                                <div className="btn_container">

                                    <button className='btn github marg' onClick={() => {
                                        window.location.href = 'https://github.com/bishakhne0gi/FoodNFun-for-HackTheMountains2.0';
                                    }}>
                                        Github
                                    </button>
                                    <button className='btn github marg' onClick={() => {
                                        window.location.href = 'https://devfolio.co/projects/food-n-fun-9225';
                                    }}>
                                        Live
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="slider__container2">
                                <div className="title">
                                    4. URL SHORTENER
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
                                    5. Dashboard UI
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
                                    6. ENVELOPE
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
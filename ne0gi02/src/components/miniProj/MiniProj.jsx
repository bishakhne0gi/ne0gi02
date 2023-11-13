import React, { useRef, useEffect } from 'react'
import './miniProj.css'
import ok from '../../assets/bugbyte.png'

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const MiniProj = () => {





    return (
        <>
            <div className="miniProj__container section__padding">
                <div className="header" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="1000" das-aos-offset="300">
                    Mini Projects
                </div>
                <div className="swiper__container section__padding" data-aos="fade-up" data-aos-easing="linear" data-aos-duration="1000" das-aos-offset="300">
                    <Swiper
                        slidesPerView={1}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Autoplay, Pagination]}
                        className="mini"
                        autoplay={{ delay: 2000 }} // Autoplay with a 3-second delay (adjust as needed)
                        loop={true}
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
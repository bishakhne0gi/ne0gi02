import React from 'react'
import './projectCards.css'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cube';
import 'swiper/css/pagination';
import { Autoplay, EffectCube, Pagination } from 'swiper/modules';
const ProjectCards = ({ pic1, pic2, pic3, title, description, one, two, three, four, five, six, a1, a2, a3, github }) => {


    const navigateToGitHub = () => {
        // Redirect to the GitHub page
        window.location.href = github;
    };

    return (
        <>
            <div className="projectCards__container">
                <div className="inner">
                    <div className="swiper_container">

                        <Swiper
                            style={{ "--swiper-pagination-color": "#7CA982" }}
                            effect={'cube'}
                            grabCursor={true}



                            pagination={true}
                            modules={[Autoplay, EffectCube, Pagination]}
                            className="mySwiper"
                            autoplay={{ delay: 3000 }} // Autoplay with a 3-second delay (adjust as needed)
                            loop={true}
                        >
                            <SwiperSlide>
                                <img src={pic1} />
                                {/* "https://swiperjs.com/demos/images/nature-1.jpg"  */}
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src={pic2} />
                                {/* <img src="https://swiperjs.com/demos/images/nature-2.jpg" /> */}
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src={pic3} />
                                {/* <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
                                 */}
                            </SwiperSlide>

                        </Swiper>
                    </div>
                    <div className="projectCards__title">
                        {title}
                    </div>
                    <div className="projectCards_description section__padding">
                        {description}
                    </div>

                </div>
                <div className="bottom">
                    <div className="inner_techstack">

                        <div className="tech_container left">

                            <div className="projectCards_techstackTitle">
                                Tech Stack:

                            </div>
                            <div className="projectCards__techStack ">


                                <div className="techStack">
                                    <li>

                                        {one}
                                    </li>
                                    <li>

                                        {two}
                                    </li>
                                    <li>

                                        {three}
                                    </li>
                                    <li>

                                        {four}
                                    </li>
                                    <li>

                                        {four}
                                    </li>
                                    <li>

                                        {five}
                                    </li>

                                    <li>

                                        {six}
                                    </li>


                                </div>
                            </div>

                        </div>


                        <div className="tech_container right">

                            <div className="projectCards_techstackTitle">
                                Awards:

                            </div>
                            <div className="projectCards__techStack ">


                                <div className="techStack">
                                    <li>

                                        {a1}
                                    </li>
                                    <li>

                                        {a2}
                                    </li>
                                    <li>

                                        {a3}
                                    </li>



                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="projectCards_button section__padding">
                        <button className='btn github' onClick={navigateToGitHub}>
                            Github
                        </button>
                        <button className='btn live'>
                            Live
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ProjectCards
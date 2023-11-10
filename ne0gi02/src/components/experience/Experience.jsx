import React from 'react'
import './experience.css'

import DEV from '../../assets/dev.png'

const Experience = () => {
    return (
        <>
            <div className="experience_container section__padding">
                <div className="header experience_title" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="1000" das-aos-offset="300">
                    Experience
                </div>
                <div className="container_experience section__padding">


                    <div className="text it1" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500">Upcoming Software Engineer</div>
                    <hr className="hrz it2" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500" />
                    <img className="ig it3" src={DEV} data-aos="flip-up" data-aos-easing="linear" data-aos-duration="500"></img>
                    <hr className="hrz it4" data-aos="fade-left" data-aos-easing="linear" data-aos-duration="500" />
                    <div className="text1 it5" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500">IBSsoftware <br /> <span style={{ color: `var(--highlight)` }}>[ 2024 ]</span></div>

                    <div className="vl vrt1" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500"></div>

                    <div className="text it6" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500">Full-stack Developer Intern</div>
                    <hr className="hrz it7" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500" />
                    <img className="ig it8" src={DEV} data-aos="flip-up" data-aos-easing="linear" data-aos-duration="500"></img>
                    <hr className="hrz it9" data-aos="fade-left" data-aos-easing="linear" data-aos-duration="500" />
                    <div className="text1 it10" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500">Cardiocare & VNG <br /> <span style={{ color: `var(--highlight)` }}>[ Jan 2023 - May 2023 ]</span></div>

                    <div className="vl vrt2" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500"></div>

                    <div className="text it11" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500">Full-stack Developer Intern</div>
                    <hr className="hrz it12" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500" />
                    <img className="ig it13" src={DEV} data-aos="flip-up" data-aos-easing="linear" data-aos-duration="500"></img>
                    <hr className="hrz it14" data-aos="fade-left" data-aos-easing="linear" data-aos-duration="500" />
                    <div className="text1 it15" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500">Celebrare<br /> <span style={{ color: `var(--highlight)` }}>[ Sept 2021 - Oct 2021 ]</span></div>

                    <div className="vl vrt3" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500"></div>

                    <div className="text it16" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500">Top 74 in HackwithInfy'22</div>
                    <hr className="hrz it17" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500" />
                    <img className="ig it18" src={DEV} data-aos="flip-up" data-aos-easing="linear" data-aos-duration="500"></img>
                    <hr className="hrz it19" data-aos="fade-left" data-aos-easing="linear" data-aos-duration="500" />
                    <div className="text1 it20" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500">Infosys<br /> <span style={{ color: `var(--highlight)` }}>Campus Ambassador[ May 2022 - May 2023 ]</span></div>

                </div>
            </div>
        </>
    )
}

export default Experience
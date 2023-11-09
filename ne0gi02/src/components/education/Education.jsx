import React from 'react'
import './education.css'
import AOT from '../../assets/aot.png'
import DBB from '../../assets/dbb.png'
import ICSE from '../../assets/icse.png'
import ISC from '../../assets/isc.png'
import CGPA from '../../assets/cgpa.png'


const Education = () => {
    return (
        <>
            <div id="education" className="education_container section__padding">
                <div className="header" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="1000" das-aos-offset="300">
                    Education
                </div>
                <div className="container_education section__padding">


                    <div className="text it1" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500">Schooling</div>
                    <hr className="hrz it2" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500" />
                    <img className="ig it3" src={DBB} data-aos="flip-up" data-aos-easing="linear" data-aos-duration="500"></img>
                    <hr className="hrz it4" data-aos="fade-left" data-aos-easing="linear" data-aos-duration="500" />
                    <div className="text1 it5" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500">Don Bosco School, Bandel <br /> <span style={{ color: `var(--highlight)` }}>[ 2008 - 2020 ]</span></div>

                    <div className="vl vrt1" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500"></div>


                    <img className="ig it8" src={ICSE} data-aos="flip-up" data-aos-easing="linear" data-aos-duration="500"></img>
                    <hr className="hrz it9" data-aos="fade-left" data-aos-easing="linear" data-aos-duration="500" />
                    <div className="text1 it10" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500">Indian Certificate of Secondary Education(class X)<br /> <span style={{ color: `var(--highlight)` }}>[ 92% ]</span></div>

                    <div className="vl vrt2" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500"></div>

                    <img className="ig it13" src={ISC} data-aos="flip-up" data-aos-easing="linear" data-aos-duration="500"></img>
                    <hr className="hrz it14" data-aos="fade-left" data-aos-easing="linear" data-aos-duration="500" />
                    <div className="text1 it15" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500">Indian School Certificate(class XII) <br /> <span style={{ color: `var(--highlight)` }}>[ 91% ]</span></div>

                    <div className="vl vrt3" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500"></div>

                    <div className="text it16" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500">B.Tech in Computer Science & Engineering</div>
                    <hr className="hrz it17" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="500" />
                    <img className="ig it18" src={AOT} data-aos="flip-up" data-aos-easing="linear" data-aos-duration="500"></img>
                    <hr className="hrz it19" data-aos="fade-left" data-aos-easing="linear" data-aos-duration="500" />
                    <div className="text1 it20" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500">Academy of Technology<br /> <span style={{ color: `var(--highlight)` }}>[ 2020 - 2024 ]</span></div>

                    <div className="vl vrt4" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500"></div>

                    <img className="ig it23" src={CGPA} data-aos="flip-up" data-aos-easing="linear" data-aos-duration="500"></img>
                    <hr className="hrz it24" data-aos="fade-left" data-aos-easing="linear" data-aos-duration="500" />
                    <div className="text1 it25" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="500">Till 6th Semester <br /> <span style={{ color: `var(--highlight)` }}>[ 9.3 ]</span></div>
                </div>
            </div>
        </>
    )
}

export default Education
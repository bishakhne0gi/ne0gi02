import React from 'react'
import './skillCards.css'



const SkillCards = ({ title, title_img, one, one_val, two, two_val, three, three_val, four, four_val, five, five_val, six, six_val, sev, sev_val }) => {



    return (
        <>
            <div className="card"
                data-aos="fade-zoom-in" data-aos-offset="300"
                data-aos-easing="linear"
                data-aos-duration="1000">

                <div className="card_header">

                    <div className="card_img">

                        {title_img}


                    </div>
                    <div className="card_text">
                        {title}
                    </div>

                </div>

                <div className="skill_wrap">
                    <div className="skill_key">
                        {one}
                    </div>
                    <div className="skill_val">
                        {one_val}
                    </div>

                </div>
                <div className="skill_wrap">
                    <div className="skill_key">
                        {two}
                    </div>
                    <div className="skill_val">
                        {two_val}
                    </div>

                </div>
                <div className="skill_wrap">
                    <div className="skill_key">
                        {three}
                    </div>
                    <div className="skill_val">
                        {three_val}
                    </div>

                </div>
                <div className="skill_wrap">
                    <div className="skill_key">
                        {four}
                    </div>
                    <div className="skill_val">
                        {four_val}
                    </div>

                </div>
                <div className="skill_wrap">
                    <div className="skill_key">
                        {five}
                    </div>
                    <div className="skill_val">
                        {five_val}
                    </div>

                </div>
                <div className="skill_wrap">
                    <div className="skill_key">
                        {six}
                    </div>
                    <div className="skill_val">
                        {six_val}
                    </div>

                </div>
                <div className="skill_wrap">
                    <div className="skill_key">
                        {sev}
                    </div>
                    <div className="skill_val">
                        {sev_val}
                    </div>

                </div>
            </div>
        </>
    )
}

export default SkillCards
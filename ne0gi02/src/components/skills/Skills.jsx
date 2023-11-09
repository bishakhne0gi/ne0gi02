import React, { useState, useEffect } from 'react';
import './skills.css'
import data from '../../utils/skillset'
import SkillCards from '../skillsCards/skillCards';
const Skills = () => {





    const [skills, setSkills] = useState(data);


    return (
        <>
            <div id="skill" className="container_skills section__padding">
                <div className="header" data-aos="fade-right" data-aos-easing="linear" data-aos-duration="1000" das-aos-offset="300">
                    Skills


                </div>
                <div className="cards_wrap section__padding"
                    data-aos="fade-zoom-in" data-aos-offset="400"
                    data-aos-easing="linear"
                    data-aos-duration="1000" >

                    {skills.skill.map((skill) => (
                        <SkillCards
                            key={skill.id}
                            title={skill.title}
                            title_img={<skill.title_img />}
                            one={skill.one}
                            one_val={<skill.one_val />}
                            two={skill.two}
                            two_val={<skill.two_val />}
                            three={skill.three}
                            three_val={<skill.three_val />}
                            four={skill.four}
                            four_val={<skill.four_val />}
                            five={skill.five}
                            five_val={<skill.five_val />}
                            six={skill.six}
                            six_val={<skill.six_val />}
                            sev={skill.sev}
                            sev_val={<skill.sev_val />}


                        />
                    ))}



                </div>
            </div>
        </>
    )
}

export default Skills
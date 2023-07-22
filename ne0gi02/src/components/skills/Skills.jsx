import React, { useState, useEffect } from 'react';
import './skills.css'
import data from '../../utils/skillset'
import SkillCards from '../skillsCards/skillCards';
const Skills = () => {





    const [skills, setSkills] = useState(data);


    return (
        <>
            <div className="container_skills section__padding">
                <div className="header">
                    Skills


                    <div className="cards_wrap">

                        {skills.skill.map((skill) => (
                            <SkillCards
                                key={skill.id}
                                title={skill.title}
                                title_img={<skill.title_img />}
                                one={skill.one}
                                one_val={<skill.one_val />}
                            />
                        ))}
                        {/* {console.log(skills.skill[0])} */}
                        {/* </div> */}
                        {/* <div className="cards_wrap section__padding">


                        <SkillCards />
                        <SkillCards />
                        <SkillCards /> */}

                        {/* {console.log(skills.skill[0])} */}
                    </div>


                </div>
            </div>
        </>
    )
}

export default Skills
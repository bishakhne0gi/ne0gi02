import React from 'react'
import './skillCards.css'
import Frontend from '../../assets/svg/Frontend'
import IconBxlJavascript from '../../assets/svg/Javscript'
// const SkillCards = ({ title, description, level }) => {



//     return (
//         <>
//             <div className="card">
//                 <h2>{title}</h2>
//                 <p>{description}</p>
//                 <p>Level: {level}</p>
//             </div>
//         </>
//     )
// }


const SkillCards = ({ title, title_img, one, one_val }) => {



    return (
        <>
            <div className="card">

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
            </div>
        </>
    )
}

export default SkillCards
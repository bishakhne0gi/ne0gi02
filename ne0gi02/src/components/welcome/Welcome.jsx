import React, { useEffect } from 'react'
import './welcome.css'

import { useTypewriter, Cursor } from 'react-simple-typewriter'

import AOS from 'aos';
import 'aos/dist/aos.css';

const Welcome = () => {

    const [text] = useTypewriter({
        words: ['Student', 'Problem Solver', 'Fullstack Developer'],
        loop: true,
        onLoopDone: () => console.log(`loop completed after 3 runs.`)
    })



    useEffect(() => {
        AOS.init();
    }, [])

    return (
        <>
            <div className='welcome__container section__padding' data-aos="fade-right" data-aos-offset="300"
                data-aos-easing="linear"
                data-aos-duration="1000">

                <div className="greetings">

                    <div className="dear">
                        Dear
                    </div>
                    <div className="sir">
                        Sir/Ma'am,
                    </div>


                </div>

                <div className="welcome">

                    <h3 className="heading-1">
                        I'm
                    </h3>

                    <h3 className="heading-2">
                        BISHAKH NEOGI
                    </h3>

                </div>


                <div className="container-2">

                    <h3 className="txt_type">
                        {text}
                        <Cursor cursorColor='var(--highlight)' />
                    </h3>
                </div>


            </div>
        </>
    )
}

export default Welcome
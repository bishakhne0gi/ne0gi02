import React, { useEffect, useState } from 'react'
import './navbar.css'

import { ArrowLineUp } from '@phosphor-icons/react';
import { Education, Experience, Footer, Opening, Picture, Projects, Salutation, Skills, Thanking, Welcome, HamburgerMenu, Connect, HOF } from '../../components'
import { Link, Element, Events, animateScroll as scroll } from 'react-scroll';

const Navbar = () => {

    const scrollToTop = () => {
        scroll.scrollToTop();
    };



    const [windowWidth, setWindowWidth] = useState(window.innerWidth);


    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, [])


    const isMobile = windowWidth <= 770








    return (
        <>


            <Opening />

            <div className='container'>
                {isMobile ? (
                    <HamburgerMenu />
                ) : (

                    <nav className="navbar">
                        <ul>
                            <div className="navbar_left">

                                <li>
                                    <Link to="greeting" smooth={true} >Greetings</Link>
                                </li>
                                <li>
                                    <Link to="education" smooth={true} >Education</Link>
                                </li>
                                <li>
                                    <Link to="skill" smooth={true} >Skills</Link>
                                </li>
                                <li>
                                    <Link to="project" smooth={true} >Projects</Link>
                                </li>
                                <li>
                                    <Link to="experience" smooth={true} >Experience</Link>
                                </li>
                                <li>
                                    <Link to="hof" smooth={true}>Hall Of Fame</Link>
                                </li>
                                <li>
                                    <Link to="connect" smooth={true}>Connect</Link>
                                </li>

                            </div>
                            <div className="navbar_right">

                                <ArrowLineUp className='arrow' size={20} onClick={scrollToTop} color="var(--tertiary)" />
                            </div>

                        </ul>
                    </nav>
                )}

                <Element name="greeting" className="section">
                    <Welcome />
                    <Picture />
                </Element>

                <Element name="education" className="section">
                    <Education />
                </Element>

                <Element name="skill" className="section">
                    <Skills />
                </Element>
                <Element name="project" className="section">
                    <Projects />

                </Element>

                <Element name="experience" className="section">
                    <Experience />


                </Element>
                <Element name="hof" className="section">
                    <HOF />


                </Element>
                <Element name="connect" className="section">
                    <Connect />
                </Element>
                <Element name="thank" className="section">
                    <Thanking />
                </Element>
                <Element name="salute" className="section">
                    <Salutation />
                </Element>
                <Element name="footer" className="section">
                    <Footer />
                </Element>
            </div>

        </>
    )
}

export default Navbar
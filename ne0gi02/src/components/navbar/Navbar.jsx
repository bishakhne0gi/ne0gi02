import React, { useEffect, useState } from 'react'
import './navbar.css'


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
                            {/* <li>
                                <Link to="connect" smooth={true}>Connect</Link>
                            </li> */}
                        </ul>
                        {/* <button onClick={scrollToTop}>Scroll to Top</button> */}
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
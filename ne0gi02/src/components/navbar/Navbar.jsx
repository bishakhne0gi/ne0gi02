import React from 'react'
import './navbar.css'


import { Education, Experience, Footer, Opening, Picture, Projects, Salutation, Skills, Thanking, Welcome } from '../../components'
import { Link, Element, Events, animateScroll as scroll } from 'react-scroll';

const Navbar = () => {

    const scrollToTop = () => {
        scroll.scrollToTop();
    };

    return (
        <>
            <Opening />
            {/* <div className="container">
                <div className="navbar">
                    <ul>
                        <li><a href="#home">Greetings</a></li>
                        <li><a href="#education">Education</a></li>
                        <li><a href="#skill">Skills</a></li>
                        <li><a href="#project">Projects</a></li>

                    </ul>
                </div>


                <div className="content">
                    <Welcome />
                    <Picture />
                    <Education />
                    <Skills />
                    <Projects />
                    <Experience />
                    <Thanking />
                    <Salutation />
                </div>
            </div> */}
            <div className='container'>

                <nav className="navbar">
                    <ul>
                        <li>
                            <Link to="greeting" spy={true} smooth={true} duration={500}>Greetings</Link>
                        </li>
                        <li>
                            <Link to="education" spy={true} smooth={true} duration={500}>Education</Link>
                        </li>
                        <li>
                            <Link to="skill" spy={true} smooth={true} duration={500}>Skills</Link>
                        </li>
                        <li>
                            <Link to="project" spy={true} smooth={true} duration={500}>Projects</Link>
                        </li>
                        <li>
                            <Link to="experience" spy={true} smooth={true} duration={500}>Experience</Link>
                        </li>
                        <li>
                            <Link to="connect" spy={true} smooth={true} duration={500}>Connect</Link>
                        </li>
                    </ul>
                    {/* <button onClick={scrollToTop}>Scroll to Top</button> */}
                </nav>

                <Element name="greeting" className="section">
                    <Welcome />
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
                    <Thanking />
                    <Salutation />

                </Element>
                <Element name="connect" className="section">
                    {/* <Projects /> */}
                </Element>
                <Footer />
            </div>
        </>
    )
}

export default Navbar
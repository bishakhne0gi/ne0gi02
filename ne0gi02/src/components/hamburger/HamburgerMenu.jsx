// HamburgerMenu.js
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './hamburgerMenu.css';
import { ArrowLineUp } from '@phosphor-icons/react';
import { Link, animateScroll as scroll } from 'react-scroll';
const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const scrollToTop = () => {
    scroll.scrollToTop();
  };
  return (
    <div className="hamburger-menu">
      <div className="menu-icon" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
      <ArrowLineUp className="menu-icon" size={20} onClick={scrollToTop} style={{ marginLeft: '0.5rem' }} />
      {isOpen &&
        (<div className="menu-links">
          <Link to="greeting" smooth={true}>
            Greetings
          </Link>
          <Link to="education" smooth={true} >
            Education
          </Link>
          <Link to="skill" smooth={true} >
            Skills
          </Link>
          <Link to="project" smooth={true} >
            Projects
          </Link>
          <Link to="experience" smooth={true} >
            Experience
          </Link>
          <Link to="hof" smooth={true} >
            Hall Of Fame
          </Link>
          <Link to="connect" smooth={true} >
            Connect
          </Link>

        </div>
        )}
    </div>
  );
};

export default HamburgerMenu;

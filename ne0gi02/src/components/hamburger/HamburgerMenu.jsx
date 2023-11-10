// HamburgerMenu.js
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-scroll';
import './hamburgerMenu.css';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hamburger-menu">
      <div className="menu-icon" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
      {isOpen &&
        (<div className="menu-links">
          <Link to="greeting" spy={true} smooth={true} duration={500} onClick={toggleMenu}>
            Greetings
          </Link>
          <Link to="education" spy={true} smooth={true} duration={500} onClick={toggleMenu}>
            Education
          </Link>
          <Link to="skill" spy={true} smooth={true} duration={500} onClick={toggleMenu}>
            Skills
          </Link>
          <Link to="project" spy={true} smooth={true} duration={500} onClick={toggleMenu}>
            Projects
          </Link>
          <Link to="experience" spy={true} smooth={true} duration={500} onClick={toggleMenu}>
            Experience
          </Link>
          <Link to="connect" spy={true} smooth={true} duration={500} onClick={toggleMenu}>
            Connect
          </Link>
        </div>
        )}
    </div>
  );
};

export default HamburgerMenu;

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
          <Link to="connect" smooth={true} >
            Connect
          </Link>
        </div>
        )}
    </div>
  );
};

export default HamburgerMenu;

import React, { useEffect } from 'react'
import './App.css'
import { Education, Experience, Footer, Navbar, Opening, Picture, Projects, Salutation, Skills, Thanking, Welcome } from './components'

import AOS from 'aos';
import 'aos/dist/aos.css';

const App = () => {
  useEffect(() => {
    AOS.init();
  }, [])

  return (
    <>
      <Navbar />
      {/* <Opening />
      <Welcome />
      <Picture />
      <Education />
      <Skills />
      <Projects />
      <Experience />
      <Thanking />
      <Salutation />
      <Footer /> */}
    </>
  )
}

export default App
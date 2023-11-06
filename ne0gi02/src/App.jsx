import React, { useEffect } from 'react'
import './App.css'
import { Education, Experience, Opening, Picture, Projects, Skills, Welcome } from './components'

import AOS from 'aos';
import 'aos/dist/aos.css';

const App = () => {
  useEffect(() => {
    AOS.init();
  }, [])

  return (
    <>
      <Opening />
      <Welcome />
      <Picture />
      <Education />
      <Skills />
      <Projects />
      <Experience />
    </>
  )
}

export default App
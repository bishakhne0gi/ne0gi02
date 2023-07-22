import React from 'react'
import './App.css'
import { Education, Opening, Picture, Skills, Welcome } from './components'

const App = () => {
  return (
    <>
      <Opening />
      <Welcome />
      <Picture />
      <Education />
      <Skills />
    </>
  )
}

export default App
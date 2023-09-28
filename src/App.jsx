import React from 'react'
import {HashRouter,Routes,Route} from 'react-router-dom'
import './App.css'

import Airplane from './Components/Airplane'
import Home from './Components/Home'

function App() {
  return (
    <>
     <HashRouter>
       <Routes>
        <Route path='/' Component={Home}/>
        <Route path='/airplane/:id' Component={Airplane}/>
       </Routes>
     </HashRouter>
    </>
  )
}

export default App

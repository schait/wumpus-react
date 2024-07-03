import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { setupGame } from './game'
import './index.css'

const {map, currentX, currentY} = setupGame();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App map={map} currentX={currentX} currentY={currentY}/>
  </React.StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
//import Home from './pages/Home'
import { BrowserRouter } from 'react-router-dom';
import MainRoutes from './routes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  {/*  // <Home /> */}
    
    <BrowserRouter>
    <MainRoutes />
    </BrowserRouter>

  </StrictMode>,
)

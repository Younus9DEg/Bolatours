import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)

const hideLoader = () => {
  const loader = document.getElementById('app-loader')
  if (!loader) return
  loader.classList.add('done')
  window.setTimeout(() => loader.remove(), 350)
}

requestAnimationFrame(hideLoader)
window.setTimeout(hideLoader, 1200)

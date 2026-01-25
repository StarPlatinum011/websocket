import { BrowserRouter } from 'react-router-dom'
import MessengerUI from './pages/MessengerUI'
import './style.css'
function App() {

  return (
    <BrowserRouter>
      <MessengerUI />
    </BrowserRouter>
  )
}

export default App

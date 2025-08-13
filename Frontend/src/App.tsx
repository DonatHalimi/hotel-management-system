import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastProvider } from "./contexts/ToastContext"
import Home from './pages/Home';

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </ToastProvider>
    </Router>
  )
}

export default App
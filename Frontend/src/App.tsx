import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import Home from './pages/Home';
import Test from './pages/Test';

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/posts' element={<Test />} />
        </Routes>
      </ToastProvider>
    </Router>
  )
}

export default App;
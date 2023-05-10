import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Protected from './components/auth/Protected';
import { Home, Login, SignUp } from './pages';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
          {/* auth  */}
          <Route path="/login" element={(<Login />)} />
          <Route path="/register" element={(<SignUp />)} />
          {/* main  */}
          <Route path="/" element={
            <Protected>
                <Home />
            </Protected>
          } />

      </Routes>
    </BrowserRouter>
    <ToastContainer />
    </>
  );
}

export default App;

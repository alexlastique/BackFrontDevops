import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Register from './pages/register'
import Accounts from './pages/accounts'
import Login from './pages/login'
import AddAccount from './components/addAccount';
import UpdatePassword from './pages/user'
import Transfer from './pages/transfer'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/account" element={<Accounts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addAccount" element={<AddAccount />} />
        <Route path="/user" element={<UpdatePassword />} />
        <Route path="/transfer" element={<Transfer />} />
      </Routes>
    </Router>
  </StrictMode>,
)

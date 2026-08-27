import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/routing/ProtectedRoute'
import GuestRoute from './components/routing/GuestRoute'
import Dashboard from './pages/Dashboard'
import ApplicationDetail from './pages/ApplicationDetail'


function App() {

  return (
    <>
      <Routes>

        <Route element={<GuestRoute/>}>
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>}/>
        </Route>

        <Route element={<ProtectedRoute/>}>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/applications/:id' element={<ApplicationDetail/>}/>
        </Route>
        
      </Routes>
    </>
  )
}

export default App

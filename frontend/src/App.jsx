import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>}/>

        <Route element={<ProtectedRoute/>}>
          <Route path='/dashboard' element={<h2>DASHBOARD</h2>}/>
          <Route path='/applications/:id' element={<h2>APPLICATION DETAIL</h2>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App

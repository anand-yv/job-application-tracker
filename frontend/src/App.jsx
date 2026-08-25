import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './components/auth/Login'

function App() {

  return (
    <>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<h2>SIGNUP : HERE</h2>}/>
        <Route path='/dashboard' element={<h2>DASHBOARD</h2>}/>
        <Route path='/applications/:id' element={<h2>APPLICATION DETAIL</h2>}/>
      </Routes>
    </>
  )
}

export default App

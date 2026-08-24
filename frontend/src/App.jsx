import './App.css'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <>
      <Routes>
        <Route path='/login' element={<h1>HELOOO LOGIN HEREEE</h1>} />
        <Route path='/register' element={<h2>SIGNUP : HERE</h2>}/>
        <Route path='/dashboard' element={<h2>DASHBOARD</h2>}/>
        <Route path='/applications/:id' element={<h2>APPLICATION DETAIL</h2>}/>
      </Routes>
    </>
  )
}

export default App

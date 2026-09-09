import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/routing/ProtectedRoute'
import GuestRoute from './components/routing/GuestRoute'
import Dashboard from './pages/Dashboard'
import ApplicationDetail from './pages/ApplicationDetail'
import ApplicationForm from './pages/ApplicationForm'
import Headers from './components/Headers'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import ContactDetails from './pages/ContactDetail'


function App() {

  return (
    <>
      <Headers />
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<GuestRoute />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/applications/:id' element={<ApplicationDetail />} />
          <Route path='/applications/new' element={<ApplicationForm />} />
          <Route path='/contacts' element={<Contact />} />
          <Route path='/contacts/:id' element={<ContactDetails />} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </>
  )
}

export default App

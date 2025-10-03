import { useContext, useEffect, useState } from 'react'
import Login from './component/Auth/Login'
import EmployeeDashboard from './component/Dashboard/EmployeeDashboard'
import AdminDashboard from './component/Dashboard/AdminDashboard'
import { AuthContext } from './context/AuthProvider'

const App = () => {
  const [user, setUser] = useState(null)
  const [loggedInUserData, setLoggedInUserData] = useState(null)
  const [userData, setUserData] = useContext(AuthContext)   // ✅ fixed destructuring

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const parsed = JSON.parse(loggedInUser)
      setUser(parsed.role)
      setLoggedInUserData(parsed.data || null)
    }
  }, [])

  const handleLogin = (email, password) => {
    if (!userData) {
      alert("Auth data not loaded yet")
      return
    }

    // ✅ check admin from context
    const admin = userData.admin?.find(a => a.email === email && a.password === password)
    if (admin) {
      setUser('admin')
      setLoggedInUserData(admin)
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin', data: admin }))
      return
    }

    // ✅ check employee from context
    const employee = userData.employees?.find(e => e.email === email && e.password === password)
    if (employee) {
      setUser('employee')
      setLoggedInUserData(employee)
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'employee', data: employee }))
      return
    }

    alert("Invalid Credentials")
  }

  const handleLogout = () => {
    setUser(null)
    setLoggedInUserData(null)
    localStorage.removeItem("loggedInUser")
  }

  return (
    <>
      {!user ? <Login handleLogin={handleLogin} /> : ''}
      {user == 'admin' ? <AdminDashboard changeUser={setUser} /> : (user == 'employee' ? <EmployeeDashboard changeUser={setUser} data={loggedInUserData} /> : '')}
    </>
  )
}

export default App
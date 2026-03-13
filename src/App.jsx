import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import BlueprintsPage from './pages/BlueprintsPage.jsx'
import BlueprintDetailPage from './pages/BlueprintDetailPage.jsx'
import CreateBlueprintPage from './pages/CreateBlueprintPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFound from './pages/NotFound.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import { clearToken, isAuthenticated, subscribeAuthChanges } from './services/authStorage.js'

export default function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated())

  useEffect(() => {
    return subscribeAuthChanges(() => {
      setAuthenticated(isAuthenticated())
    })
  }, [])

  return (
    <div className="container">
      <header>
        <h1>ECI - Laboratorio de Blueprints en React</h1>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <NavLink to="/" end>
            Blueprints
          </NavLink>
          <NavLink to="/create">Crear</NavLink>
          {!authenticated && <NavLink to="/login">Login</NavLink>}
          {authenticated && (
            <button className="btn" onClick={clearToken} type="button">
              Logout
            </button>
          )}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<BlueprintsPage />} />
        <Route path="/blueprints/:author/:name" element={<BlueprintDetailPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/create" element={<CreateBlueprintPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

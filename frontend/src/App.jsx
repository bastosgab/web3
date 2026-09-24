import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Sun, Moon, Activity } from 'lucide-react';
import Home from './pages/Home/Home';
import Usuarios from './pages/Home/User/User';
import LoginPage from './pages/Login/Login';
import { loginUser } from './services/userService';

function App() {
  const [theme, setTheme] = useState('light');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogin = async (email, pass) => {
    try {
      const response = await loginUser(email, pass);
      localStorage.setItem('token', response.token);
      setToken(response.token);
      setLoginError('');
      return true;
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Credenciais inválidas');
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  const isAuthenticated = !!token;

  return (
    <BrowserRouter>
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} error={loginError} />
      ) : (
        <div className="app-layout">
          <aside className="sidebar">
            <div className="sidebar-header">
              <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={24} color="var(--primary-color)" />
                WEB III
              </div>
            </div>
            <Link to="/" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <Link to="/usuarios" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} />
              Usuários
            </Link>
            <a href="/configuracoes" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={20} />
              Configurações
            </a>
            <button type="button" onClick={handleLogout} className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', marginBottom: '1rem', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
              <LogOut size={20} />
              Sair
            </button>
          </aside>

          <div className="right-area">
            <nav className="top-navbar">
              <div className="navbar-right">
                <button
                  onClick={toggleTheme}
                  className="theme-toggle-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {theme === 'light' ? (
                    <><Moon size={18} /></>
                  ) : (
                    <><Sun size={18} /></>
                  )}
                </button>
                <div className="user-profile">Administrador</div>
              </div>
            </nav>

            <main className="page-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
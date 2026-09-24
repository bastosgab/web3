import { useState } from 'react';

function LoginPage({ onLogin, error }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const success = await onLogin(email, pass);

    if (!success) {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>
        <p>Entre com suas credenciais para acessar o sistema.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={pass}
              onChange={(event) => setPass(event.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button type="submit" disabled={loading} className="primary-button login-button">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

// Auth.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, ArrowRight, ChefHat } from 'lucide-react';
import './Auth.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/my-recipes');
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="auth-branding-content">
            <div className="brand-logo">
              <ChefHat size={48} />
            </div>
            <h1 className="pacifico-regular">Dish Diary</h1>
            <p className="brand-subtitle">
              Deine digitale Rezeptsammlung für alle kulinarischen Abenteuer
            </p>
            
            <div className="brand-features">
              <div className="brand-feature">
                <div className="feature-check">✓</div>
                <span>Unbegrenzte Rezepte</span>
              </div>
              <div className="brand-feature">
                <div className="feature-check">✓</div>
                <span>Intelligente Organisation</span>
              </div>
              <div className="brand-feature">
                <div className="feature-check">✓</div>
                <span>Kochverlauf tracken</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-wrapper">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2 className="auth-title">
                {isLogin ? 'Willkommen zurück' : 'Konto erstellen'}
              </h2>
              <p className="auth-subtitle">
                {isLogin 
                  ? 'Melde dich an, um fortzufahren' 
                  : 'Starte deine kulinarische Reise'}
              </p>
            </div>

            {error && (
              <div className="auth-error">
                <span className="error-icon">⚠</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <div className="input-wrapper">
                    <User size={20} className="input-icon" />
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                      placeholder="Dein Name"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  E-Mail
                </label>
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="deine@email.de"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Passwort
                </label>
                <div className="input-wrapper">
                  <Lock size={20} className="input-icon" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">
                    Passwort bestätigen
                  </label>
                  <div className="input-wrapper">
                    <Lock size={20} className="input-icon" />
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-input"
                      placeholder="••••••••"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    {isLogin ? 'Anmelden' : 'Registrieren'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>oder</span>
            </div>

            <button onClick={switchMode} className="auth-switch-btn">
              {isLogin ? (
                <>
                  Noch kein Konto? <strong>Jetzt registrieren</strong>
                </>
              ) : (
                <>
                  Bereits registriert? <strong>Jetzt anmelden</strong>
                </>
              )}
            </button>

            <Link to="/" className="auth-back-link">
              ← Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect, FormEvent } from 'react';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
}

const LoginComponent: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  // Email autorizzate e password
  const AUTHORIZED_EMAILS = ["s.bertele@netribegroup.com"];
  const VALID_PASSWORD = "NetribeAPI26!";

  // Funzione di validazione
  const validateCredentials = (email: string, password: string): LoginResponse => {
    if (!email || !password) {
      return { success: false, message: 'Inserisci email e password' };
    }

    if (!AUTHORIZED_EMAILS.includes(email)) {
      return { success: false, message: 'Email non autorizzata' };
    }

    if (password !== VALID_PASSWORD) {
      return { success: false, message: 'Password non valida' };
    }

    return { success: true, message: 'Accesso consentito' };
  };

  // Gestione submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Controlla tentativi (max 5)
    if (attempts >= 5) {
      setError('Troppi tentativi errati. Attendi 5 minuti.');
      setLoading(false);
      return;
    }

    // Simula chiamata API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const validation = validateCredentials(credentials.email, credentials.password);

    if (validation.success) {
      console.log('✅ Accesso autorizzato');
      
      // Salva sessione
      sessionStorage.setItem('auth_token', btoa(JSON.stringify({
        email: credentials.email,
        timestamp: new Date().toISOString(),
        expires: Date.now() + (8 * 60 * 60 * 1000) // 8 ore
      })));
      
      // Reindirizza
      window.location.href = '/index.html';
    } else {
      console.log('❌ Accesso negato:', validation.message);
      setError(validation.message);
      setAttempts(prev => prev + 1);
      setCredentials(prev => ({ ...prev, password: '' }));
      setLoading(false);
    }
  };

  // Reset tentativi dopo 5 minuti
  useEffect(() => {
    if (attempts > 0) {
      const timer = setTimeout(() => {
        setAttempts(0);
        console.log('Tentativi reset');
      }, 5 * 60 * 1000); // 5 minuti
      
      return () => clearTimeout(timer);
    }
  }, [attempts]);

  // Controlla se già loggato
  useEffect(() => {
    const authToken = sessionStorage.getItem('auth_token');
    if (authToken) {
      try {
        const data = JSON.parse(atob(authToken));
        if (data.expires > Date.now()) {
          console.log('Utente già autenticato');
          // window.location.href = '/index.html';
        } else {
          sessionStorage.removeItem('auth_token');
        }
      } catch {
        sessionStorage.removeItem('auth_token');
      }
    }
  }, []);

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">🔐 Accesso Amministrativo</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              className="form-input"
              placeholder="s.bertele@netribegroup.com"
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="form-input"
              placeholder="NetribeAPI26!"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
          
          {error && (
            <div className="error-alert">
              <strong>Errore:</strong> {error}
              {attempts > 0 && (
                <div className="attempts-warning">
                  Tentativi errati: {attempts}/5
                </div>
              )}
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Verifica in corso...
              </>
            ) : (
              'Accedi al Dashboard'
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <div className="security-notice">
            <strong>Accesso riservato:</strong> Solo personale autorizzato
          </div>
          <div className="credentials-hint">
            Usa le credenziali fornite dall'amministratore
          </div>
        </div>
      </div>
      
      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        
        .login-card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 420px;
        }
        
        .login-title {
          color: #333;
          text-align: center;
          margin-bottom: 30px;
          font-size: 24px;
        }
        
        .form-field {
          margin-bottom: 20px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #555;
        }
        
        .form-input {
          width: 100%;
          padding: 14px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        }
        
        .form-input:disabled {
          background: #f8f9fa;
          cursor: not-allowed;
        }
        
        .error-alert {
          background: #f8d7da;
          color: #721c24;
          padding: 12px 16px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #dc3545;
        }
        
        .attempts-warning {
          margin-top: 8px;
          font-size: 14px;
          color: #856404;
        }
        
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(180deg, #28a745, #1e7e34);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(40,167,69,0.3);
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .login-footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          font-size: 14px;
        }
        
        .security-notice {
          color: #6c757d;
          margin-bottom: 10px;
        }
        
        .credentials-hint {
          color: #17a2b8;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default LoginComponent;

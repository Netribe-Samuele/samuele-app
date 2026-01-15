import React, { useState } from 'react';

function check(mail: string, password: string): boolean {
  const validEmails = ["s.bertele@netribegroup.com"];
  const validPassword = "NetribeAPI26!";

  // Verifica se l'email è nella lista E se la password è corretta
  return validEmails.includes(mail) && password === validPassword;
}

function LoginPage() {
  // Stato per email e password
  const [mail, setMail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simula un piccolo ritardo per feedback visivo
    setTimeout(() => {
      if (check(mail, password)) {
        console.log("✅ Accesso consentito");
        
        // Salva stato login (opzionale)
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', mail);
        
        // Reindirizza a index.html
        window.location.href = 'index.html';
      } else {
        console.log("❌ Accesso negato");
        setError('Email o password non validi');
        
        // Pulisci campo password per sicurezza
        setPassword('');
        
        // Focus sul campo email
        document.querySelector<HTMLInputElement>('input[name="mail"]')?.focus();
      }
      setIsLoading(false);
    }, 500);
  };

  // Verifica se già loggato (opzionale)
  React.useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      console.log("Utente già autenticato, reindirizzamento...");
      // window.location.href = 'index.html';
    }
  }, []);

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Login</h1>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Email:
          </label>
          <input 
            type="email" 
            name="mail" 
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
            placeholder="s.bertele@netribegroup.com"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Password:
          </label>
          <input 
            type="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
            placeholder="NetribeAPI26!"
          />
        </div>
        
        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Verifica in corso...' : 'Login'}
        </button>
      </form>
      
      <div style={{ 
        marginTop: '20px', 
        paddingTop: '15px', 
        borderTop: '1px solid #eee',
        fontSize: '12px',
        color: '#666',
        textAlign: 'center'
      }}>
        <p>Credenziali di test:</p>
        <p>Email: <strong>s.bertele@netribegroup.com</strong></p>
        <p>Password: <strong>NetribeAPI26!</strong></p>
      </div>
    </div>
  );
}

// Componente principale che renderizza la pagina di login
function App() {
  return <LoginPage />;
}

export default App;

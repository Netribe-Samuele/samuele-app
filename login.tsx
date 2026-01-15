import { useState } from "react";

const VALID_EMAILS = ["s.bertele@netribegroup.com"];
const VALID_PASSWORD = "NetribeAPI26!";
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "24px",
    width: "360px",
    borderRadius: "8px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  title: {
    color: "#1877f2",
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: 700,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "14px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    outline: "none",
  },
  button: {
    marginTop: "8px",
    padding: "14px",
    fontSize: "18px",
    backgroundColor: "#1877f2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
  },
  link: {
    display: "block",
    marginTop: "16px",
    color: "#1877f2",
    fontSize: "14px",
    textDecoration: "none",
  },
  error: {
    color: "#e41e3f",
    fontSize: "14px",
  },
};

function check(email: string, password: string): boolean {
  return VALID_EMAILS.includes(email) && password === VALID_PASSWORD;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (check(email, password)) {
      console.log("Accesso consentito");
      window.location.href = "index.html";
    } else {
      setError("Email o password non valide");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Accedi a Facebook</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email o numero di telefono"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button}>
            Accedi
          </button>
        </form>

        <a href="#" style={styles.link}>
          Password dimenticata?
        </a>
      </div>
    </div>
  );
}

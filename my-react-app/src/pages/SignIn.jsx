import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/user/userSlice"; // Import de l'action 'login'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/argentBankLogo.png";


function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/api/v1/user/login", {
        email: username,
        password: password,
      });

      // Si la connexion est réussie, on sauvegarde les infos dans Redux et dans localStorage
      dispatch(login({
        userDetails: response.data.body.user, 
        token: response.data.body.token,
      }));

      localStorage.setItem("token", response.data.body.token); // Sauvegarde du token

      // Redirection vers la page de l'utilisateur
      navigate("/user");
    } catch (error) {
      console.error(error);
      setError("Invalid username or password.");
    }
  };
  
  return (
    <>
      <nav className="main-nav">
        <a className="main-nav-logo" href="/">
          <img
            className="main-nav-logo-image"
            src={logo}
            alt="Argent Bank Logo"
          />
          <h1 className="sr-only">Argent Bank</h1>
        </a>
        <div>
          <a className="main-nav-item" href="/sign-in">
            <i className="fa fa-user-circle"></i>
            Sign In
          </a>
        </div>
      </nav>
      <main className="main bg-dark">
        <section className="sign-in-content">
          <i className="fa fa-user-circle sign-in-icon"></i>
          <h1>Sign In</h1>
          <form onSubmit={handleSignIn}>
            <div className="input-wrapper">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-remember">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="sign-in-button">
              Sign In
            </button>
          </form>
        </section>
      </main>
      <footer className="footer">
        <p className="footer-text">Copyright 2020 Argent Bank</p>
      </footer>
    </>
  );
}

export default SignIn;

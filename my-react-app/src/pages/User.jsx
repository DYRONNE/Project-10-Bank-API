import "../main.css";
import "../EditForm.css";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/user/userSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/img/argentBankLogo.png";

const User = () => {
  const { isLoggedIn, token } = useSelector((state) => state.user);
  const [userDetails, setUserDetails] = useState(null); // Pour stocker les détails de l'utilisateur récupérés
  const [loading, setLoading] = useState(true); // Pour gérer le chargement des données
  const [error, setError] = useState(null); // Pour gérer les erreurs
  const [isEditing, setIsEditing] = useState(false); // Etat pour savoir si l'on est en mode édition
  const [updatedName, setUpdatedName] = useState({
    firstName: "",
    lastName: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/sign-in"); // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
    } else {
      // Récupérer les détails de l'utilisateur en utilisant le token
      axios
        .get("http://localhost:3001/api/v1/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Envoie le token dans l'en-tête
          },
        })
        .then((response) => {
          setUserDetails(response.data.body); // Mettre à jour l'état avec les détails de l'utilisateur
          setLoading(false); // Changement de l'état pour indiquer que le chargement est terminé
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération du profil utilisateur:",
            error
          );
          setError(
            "Une erreur est survenue lors de la récupération de votre profil."
          );
          setLoading(false); // Changer l'état de chargement même en cas d'erreur
        });
    }
  }, [isLoggedIn, token, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // Redirige l'utilisateur vers la page d'accueil après déconnexion
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdatedName({
      firstName: userDetails?.firstName || "",
      lastName: userDetails?.lastName || "",
    });
  };

  const capitalize = (str) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedName((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedName = {
      firstName: capitalize(updatedName.firstName.trim()),
      lastName: capitalize(updatedName.lastName.trim()),
    };

    axios
      .put("http://localhost:3001/api/v1/user/profile", formattedName, {
        headers: {
          Authorization: `Bearer ${token}`, // Envoie le token dans l'en-tête
        },
      })
      .then((response) => {
        const updatedDetails = response.data.body;
        setUserDetails(updatedDetails); // Met à jour `userDetails` localement
        setIsEditing(false); // Fermer le formulaire une fois la mise à jour effectuée
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la mise à jour du profil utilisateur:",
          error
        );
        setError(
          "Une erreur est survenue lors de la mise à jour de votre profil."
        );
      });
  };

  if (loading) {
    return <div>Loading...</div>; // Afficher un message de chargement pendant que les données sont récupérées
  }

  if (error) {
    return <div>{error}</div>; // Afficher une erreur si quelque chose a échoué
  }

  if (!isLoggedIn || !userDetails) {
    return null; // Ne rend rien si l'utilisateur n'est pas connecté ou si les détails ne sont pas encore récupérés
  }

  return (
    <div>
      <nav className="main-nav">
        <Link className="main-nav-logo" to="/">
          <img
            className="main-nav-logo-image"
            src={logo}
            alt="Argent Bank Logo"
          />
          <h1 className="sr-only">Argent Bank</h1>
        </Link>
        <div>
          <span className="main-nav-item">
            <i className="fa fa-user-circle"></i>
            {userDetails?.firstName} {userDetails?.lastName}{" "}
            {/* Afficher le nom de l'utilisateur */}
          </span>
          <button className="main-nav-item" onClick={handleLogout}>
            <i className="fa fa-sign-out"></i>
            Sign Out
          </button>
        </div>
      </nav>
      <main className="main bg-dark">
        <div className="header">
          <h1>
            Welcome back
            <br />
            {capitalize(userDetails?.firstName)}{" "}
            {capitalize(userDetails?.lastName)} !
          </h1>

          <button className="edit-button" onClick={handleEditClick}>
            Edit Name
          </button>
        </div>

        {/* Formulaire d'édition du nom et prénom */}
        {isEditing && (
          <form className="edit-form" onSubmit={handleSubmit}>
            <h2 className="edit-form-title">Edit Your Name</h2>
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName" // Nom de l'attribut pour identifier le champ
                className="form-input"
                value={updatedName.firstName}
                onChange={handleInputChange} // Utilisation du gestionnaire générique
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName" // Nom de l'attribut pour identifier le champ
                className="form-input"
                value={updatedName.lastName}
                onChange={handleInputChange} // Utilisation du gestionnaire générique
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Save Changes
              </button>
            </div>
          </form>
        )}

        <h2 className="sr-only">Accounts</h2>
        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Checking (x8349)</h3>
            <p className="account-amount">$2,082.79</p>
            <p className="account-amount-description">Available Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button">View transactions</button>
          </div>
        </section>
        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Savings (x6712)</h3>
            <p className="account-amount">$10,928.42</p>
            <p className="account-amount-description">Available Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button">View transactions</button>
          </div>
        </section>
        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
            <p className="account-amount">$184.30</p>
            <p className="account-amount-description">Current Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button">View transactions</button>
          </div>
        </section>
      </main>
      <footer className="footer">
        <p className="footer-text">Copyright 2020 Argent Bank</p>
      </footer>
    </div>
  );
};

export default User;

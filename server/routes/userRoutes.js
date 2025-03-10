const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tokenValidation = require('../middleware/tokenValidation');

// Création d'un utilisateur
router.post('/signup', userController.createUser);

// Connexion d'un utilisateur
router.post('/login', userController.loginUser);

// Récupérer le profil de l'utilisateur (GET, pas POST)
router.get(
  '/profile',
  tokenValidation.validateToken, // Valider le token avant de récupérer le profil
  userController.getUserProfile
);

// Mettre à jour le profil de l'utilisateur
router.put(
  '/profile',
  tokenValidation.validateToken, // Valider le token avant de mettre à jour
  userController.updateUserProfile
);

module.exports = router;

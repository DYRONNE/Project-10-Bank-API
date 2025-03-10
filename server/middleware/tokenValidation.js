const jwt = require('jsonwebtoken');

module.exports.validateToken = (req, res, next) => {
  let response = {};

  try {
    // Vérifier si le token est présent dans les headers
    if (!req.headers.authorization) {
      throw new Error('Token is missing from header');
    }

    // Extraire le token de l'en-tête Authorization
    const userToken = req.headers.authorization.split('Bearer')[1].trim();

    // Vérifier et décoder le token JWT
    const decodedToken = jwt.verify(
      userToken,
      process.env.SECRET_KEY || 'default-secret-key'
    );

    // Ajouter l'utilisateur décodé dans la requête (optionnel mais pratique)
    req.user = decodedToken;

    // Passer à la suite de la requête (contrôleur ou autre middleware)
    next();

  } catch (error) {
    // En cas d'erreur, on prépare la réponse d'erreur
    console.error('Error in tokenValidation.js', error);
    response.status = 401;
    response.message = error.message;

    // Renvoyer la réponse d'erreur avec un statut 401 (Unauthorized)
    return res.status(response.status).json(response);
  }
};

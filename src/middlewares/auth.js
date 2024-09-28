const Account = require("../api/models/account");
const { verifyJwt } = require("../config/jwt");

// Middleware para verificar si el usuario está autenticado
const isAuth = async (req, res, next) => {
  try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json("No estás autorizado");
      }

      const token = authHeader.split(" ")[1]; // Extrae el token eliminando "Bearer "

      const { id } = verifyJwt(token); // Verifica el token y extrae el ID del usuario

      const account = await Account.findById(id); // Busca la cuenta en la base de datos

      if (!account) {
          return res.status(401).json("No estás autorizado");
      }

      account.password = null; // Elimina la contraseña del objeto cuenta por seguridad
      req.user = account; // Añade la cuenta a la solicitud
      next(); // Continúa con la siguiente función middleware
  } catch (error) {
      return res.status(401).json("No estás autorizado");
  }
};

module.exports = { isAuth };
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config.js';

export const validateJWT = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const token = authorization.split(' ')[1]; // Extraer el token del encabezado

    if (!token) {
      return res.status(400).json({ message: 'Token no proporcionado' });
    }

    // Verificar el token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Buscar el usuario en la base de datos
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Añadir el usuario al objeto de solicitud
    req.user = user;

    next(); // Continuar con la siguiente función de middleware
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expirado' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    console.error(error); // Registro en consola para fines de depuración
    res.status(500).json({ message: 'Error al validar el token' });
  }
};

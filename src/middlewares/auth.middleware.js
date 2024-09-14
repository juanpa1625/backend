// auth.middleware.js

import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { SECRET_KEY } from '../config/config.js';

export const validateJWT = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) return res.status(400).json({ message: 'Se debe proveer un token' });

    const token = authorization.split(' ')[1];

    if (!token) return res.status(400).json({ message: 'Token no proporcionado' });

    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) return res.status(400).json({ message: 'Token expirado' });
    if (error instanceof jwt.JsonWebTokenError) return res.status(400).json({ message: 'Token inválido' });
    res.status(500).json({ message: 'Error al validar el token' });
  }
};

// auth.controller.js

import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config.js';
import bcrypt from 'bcrypt';

class AuthController {
  static async register(req, res) {
    const { correo, contraseña } = req.body;

    console.log('Datos recibidos:', req.body); 

    if (!correo || !contraseña) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    try {
      const usuarioExistente = await User.findOne('correo', correo);
      if (usuarioExistente) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      const hashedPassword = await bcrypt.hash(contraseña, 10);
      const nuevoUsuario = await User.create({
        correo,
        contraseña: hashedPassword,
      });

      const token = jwt.sign({ userId: nuevoUsuario.id }, SECRET_KEY, { expiresIn: '1h' });
      res.status(201).json({ message: 'Usuario registrado exitosamente', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  }

  static async login(req, res) {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    try {
      const usuario = await User.findOne('correo', correo);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
      if (!contraseñaValida) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ userId: usuario.id }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  }

  static async me(req, res) {
    try {
      const usuario = req.user;
      res.json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el usuario' });
    }
  }
}

export default AuthController;

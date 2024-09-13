import Usuario from '../models/user.js'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../config/config.js'
import bcrypt from 'bcrypt';

class AuthController {
  static async login(req, res) {
    const { correo, contraseña } = req.body

    try {
      const usuario = await Usuario.findOne('correo', correo)

      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña)

      if (!contraseñaValida) {
        return res.status(401).json({ message: 'Contraseña incorrecta' })
      }

      const token = jwt.sign({ userId: usuario.id }, SECRET_KEY, { expiresIn: '1h' })

      res.json({ token })
    } catch (error) {
      res.status(500).json({ message: 'Error al iniciar sesión' })
    }
  }

  static async me(req, res) {
    try {
      const usuario = req.user
      res.json(usuario)
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el usuario' })
    }
  }
}

export default AuthController

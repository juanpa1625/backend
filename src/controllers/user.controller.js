import Usuario from '../models/user.js'
import bcrypt from 'bcrypt'
import { pool } from '../config/db.js'

class UserController {
  static async index(req, res) {
    try {
      const usuarios = await Usuario.all()
      res.json(usuarios)
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener usuarios' })
    }
  }

  static async getByID(req, res) {
    try {
      const { id } = req.params
      const usuario = await Usuario.findById(id)

      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      res.json(usuario)
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el usuario' })
    }
  }

  static async store(req, res) {
    const { nombre, apellido, nombre_usuario, correo, contraseña, imagen } = req.body;

    try {
      
      if (!correo || !contraseña) {
        return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
      }

      
      const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

   
      const [result] = await pool.execute(
        'INSERT INTO usuario (nombre, apellido, nombre_usuario, correo, contraseña, imagen) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre || 'Sin nombre', apellido || 'Sin apellido', nombre_usuario || 'Sin nombre_usuario', correo, contraseñaEncriptada, imagen || 'Sin imagen']
      );

      
      const nuevoUsuario = {
        id: result.insertId,
        nombre: nombre || 'Sin nombre',
        apellido: apellido || 'Sin apellido',
        nombre_usuario: nombre_usuario || 'Sin nombre_usuario',
        correo,
        imagen: imagen || 'Sin imagen',
      };

      return res.status(201).json(nuevoUsuario);
    } catch (error) {
    
      console.log(error);
      return res.status(500).json({ error: 'Error al crear el usuario' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params
      const resultado = await Usuario.deleteById(id)

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      res.status(204).json({ message: 'Usuario eliminado' })
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el usuario' })
    }
  }

  static async updatePut(req, res) {
    const { id } = req.params
    const { nombre, apellido, nombre_usuario, correo, contraseña, imagen } = req.body

    try {
      const resultado = await Usuario.update({
        id,
        nombre,
        apellido,
        nombre_usuario,
        correo,
        contraseña,
        imagen
      })

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      res.json({ message: 'Usuario actualizado' })
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el usuario' })
    }
  }

  static async updatePatch(req, res) {
    const { id } = req.params
    const { nombre, apellido, nombre_usuario, correo, contraseña, imagen } = req.body

    try {
      const resultado = await Usuario.update({
        id,
        nombre,
        apellido,
        nombre_usuario,
        correo,
        contraseña,
        imagen
      })

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' })
      }

      res.json({ message: 'Usuario actualizado parcialmente' })
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el usuario' })
    }
  }
}

export default UserController

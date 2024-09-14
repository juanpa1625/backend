import { pool } from '../config/db.js'
import bcrypt from 'bcrypt'

class Usuario {
  static async findById(id) {
    const [usuarios] = await pool.execute(
      'SELECT id, nombre, apellido, nombre_usuario, correo, contraseña, imagen FROM usuario WHERE id = ?',
      [id]
    )
    return usuarios[0]
  }

  static async findOne(columna, valor) {
    const [usuarios] = await pool.execute(
      `SELECT id, nombre, apellido, nombre_usuario, correo, contraseña, imagen FROM usuario WHERE ${columna} = ?`,
      [valor]
    )
    return usuarios[0]
  }

  static async update({ id, nombre, apellido, nombre_usuario, correo, contraseña, imagen }) {
    let query = 'UPDATE usuario SET '
    const camposActualizar = []
    const valoresActualizar = []

    if (nombre) {
      camposActualizar.push('nombre = ?')
      valoresActualizar.push(nombre)
    }

    if (apellido) {
      camposActualizar.push('apellido = ?')
      valoresActualizar.push(apellido)
    }

    if (nombre_usuario) {
      camposActualizar.push('nombre_usuario = ?')
      valoresActualizar.push(nombre_usuario)
    }

    if (correo) {
      camposActualizar.push('correo = ?')
      valoresActualizar.push(correo)
    }

    if (contraseña) {
      camposActualizar.push('contraseña = ?')
      const encriptada = await bcrypt.hash(contraseña, 10)
      valoresActualizar.push(encriptada)
    }

    if (imagen) {
      camposActualizar.push('imagen = ?')
      valoresActualizar.push(imagen)
    }

    if (camposActualizar.length === 0) return undefined

    query += camposActualizar.join(', ') + ' WHERE id = ?'
    valoresActualizar.push(id)

    const [resultado] = await pool.execute(query, valoresActualizar)
    return resultado
  }

  static async all() {
    try {
      const [usuarios] = await pool.execute(
        'SELECT id, nombre, apellido, nombre_usuario, correo, imagen FROM usuario'
      );
      return usuarios;
    } catch (error) {
      throw new Error('Error al obtener todos los usuarios');
    }
  }

  static async deleteById(id) {
    try {
      const [resultado] = await pool.execute(
        'DELETE FROM usuario WHERE id = ?',
        [id]
      );
      return resultado;
    } catch (error) {
      throw new Error('Error al eliminar el usuario: ' + error.message);
    }
  }
  static async create(data) {
    const { correo, contraseña } = data;

    if (!correo || !contraseña) {
      throw new Error('Correo or contraseña is missing');
    }

    const [result] = await pool.execute(
      'INSERT INTO usuario (correo, contraseña) VALUES (?, ?)',
      [correo, contraseña]
    );
    return { id: result.insertId, correo, contraseña };
  }

}

export default Usuario

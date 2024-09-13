import User from '../models/user.js'

export const validateUserID = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findById(id)

    if (!user) return res.status(404).json({ message: 'El usuario no existe' })

    req.user = user

    next()
  } catch (error) {
    res.status(500).json({ message: 'Error al validar el ID' })
  }
}

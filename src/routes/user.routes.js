import { Router } from 'express'
import UserController from '../controllers/user.controller.js'
import { validateUserID } from '../middlewares/user.middleware.js'

const router = Router()

router.get('/', UserController.index)
router.get('/:id', validateUserID, UserController.getByID)
router.post('/', UserController.store)
router.delete('/:id', validateUserID, UserController.delete)
router.put('/:id', validateUserID, UserController.updatePut)
router.patch('/:id', validateUserID, UserController.updatePatch)

export default router

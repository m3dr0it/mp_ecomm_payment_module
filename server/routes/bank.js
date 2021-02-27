import {getBank,insertBank,updateBank,deleteBank} from '../controllers/bankController'
// const {getBank,insertBank,updateBank,deleteBank} = require('../controllers/bankController')
const Router = require('express').Router
const router = Router()

router.get('/',getBank)
router.post('/',insertBank)
router.put('/:bank_id',updateBank)
router.delete('/:bank_id',deleteBank)

export default router
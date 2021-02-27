import {getPaymentType,insertPaymentType,updatePaymentType,deletePaymentType} from '../controllers/paymentTypeController'
// const {getPaymentType,insertPaymentType,updatePaymentType,deletePaymentType} = require('../controllers/paymentTypeController')
const Router = require('express').Router
const router = Router()

router.get('/',getPaymentType)
router.post('/',insertPaymentType)
router.put('/:paty_name',updatePaymentType)
router.delete('/:paty_name',deletePaymentType)

export default router
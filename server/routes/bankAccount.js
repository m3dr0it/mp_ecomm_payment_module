const Router = require('express').Router
const router = Router()
// const {getBankAccount,insertBankAccount,updateBankAccount,deleteBankAccount} = require('../controllers/bankAccountController')
import {getBankAccountByAccount,
    insertBankAccount,
    updateBankAccount,
    deleteBankAccount,
    getBankAccountAndBank
} from '../controllers/bankAccountController'

router.get('/orders',getBankAccountAndBank)
router.get('/:acco_id',getBankAccountByAccount)
router.post('/',insertBankAccount)
router.put('/:bacc_id',updateBankAccount)
router.delete('/:bacc_id',deleteBankAccount)

export default router
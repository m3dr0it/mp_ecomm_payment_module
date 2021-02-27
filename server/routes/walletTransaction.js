const Router = require('express').Router
const router = Router()
import {
    getWalletTransactionByAccount,
    insertWalletTransaction,
    updateWalletTransaction,
    deleteWalletTransaction,
    newTransaction
} from '../controllers/walletTransactionController'

router.get('/:acco_id',getWalletTransactionByAccount)
router.post('/',newTransaction)
router.put('/',updateWalletTransaction)
router.delete('/',deleteWalletTransaction)

export default router
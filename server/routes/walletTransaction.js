const Router = require('express').Router
const router = Router()
import {
    getWalletTransactionByAccount,
    insertWalletTransaction,
    updateWalletTransaction,
    deleteWalletTransaction,
    newTransaction,
    verifyTrans,
    transactionBankTransfer,
    getBillingToken,
} from '../controllers/walletTransactionController'

router.post('/generate-token',getBillingToken)
router.get('/transfer-bank/:token',transactionBankTransfer,newTransaction)
router.get('/:acco_id',getWalletTransactionByAccount)
router.post('/',verifyTrans,newTransaction)
router.put('/',updateWalletTransaction)
router.delete('/',deleteWalletTransaction)

export default router
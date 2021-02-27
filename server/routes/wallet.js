import walletTransaction from '../models/walletTransaction.model'

// import {getWallet,insertWallet,updateWallet,deleteWallet} from '../server/controllers/walletController'
const {getProdIdAndAccount,getCart,getWalletPaymentType,getWalletByAccount,insertWallet,updateWallet,deleteWallet,getSaldoAccount} = require('../controllers/walletController')
const {addSaldo} = require('../controllers/walletTransactionController')
const Router = require('express').Router
const router = Router()

router.get('/productId',getProdIdAndAccount)
router.get('/paymentType',getWalletPaymentType)
router.get('/cart/:cart_id',getCart)

// router.get('/:acco_id',getWalletByAccount)
router.post('/',insertWallet)
router.put('/:wale_id',updateWallet)
router.delete('/:wale_id',deleteWallet)
router.get('/saldo/addSaldo/:acco_id/:amount',addSaldo)
router.get('/saldo/:acco_id',getSaldoAccount)
// router.get('/wallet/paymentType',getWalletPaymentType)
export default router
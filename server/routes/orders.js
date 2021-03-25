import {Router} from 'express';
import {getOrders,createOrder,cancelOrder} from '../controllers/ordersController'
//import {getWalletTranscation, getCarts} from '../controllers/newOrders'

const router = Router();
router.get('/:order_acco_id', getOrders);
router.post('/cancel',cancelOrder)
router.post('/:order_acco_id',createOrder)

export default router;
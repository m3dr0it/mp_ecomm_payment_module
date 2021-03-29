import {Router} from 'express';
import {getOrders,createOrder,cancelOrder,getOrderedProduct,updateOrder, finishOrder} from '../controllers/ordersController'
//import {getWalletTranscation, getCarts} from '../controllers/newOrders'

const router = Router();
router.get('/ordered-product/:acco_id',getOrderedProduct)
router.get('/:order_acco_id', getOrders);
router.post('/cancel',cancelOrder)
router.post('/process',updateOrder)
router.put('/finish',finishOrder)
router.post('/:order_acco_id',createOrder)

export default router;
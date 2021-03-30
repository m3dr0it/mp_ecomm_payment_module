import { sequelize } from '../models/index'
import { getLastTransWallet } from './services/getLastTransWallet'
import { createTransaction } from './services/createNewTransaction'
import { prepareCancelTransaction, preFinishOrderData, prepareTransaction } from './services/prepareTransaction'

const getOrders = async (req, res, next) => {
    try {
        const { order_acco_id } = req.params
        const { orders } = req.context.models
        const gotOrders = await orders.findAll({ where: { order_acco_id } })
        res.json(gotOrders)
    } catch (error) {
        res.json(error)
    }
}

const createOrder = async (req, res, next) => {
    const {
        order_status,
        order_subtotal,
        order_shipping,
        order_discount,
        order_tax,
        order_total_due,
        order_total_qty,
        order_watr_numbers,
        order_is_receive,
        order_stat_name,
        order_weight
    } = req.body

    try {
        console.log("test")
        const { order_acco_id } = req.params
        const { orders } = req.context.models
        const queryGetLastRow = "select nextval('order_name_seq')";
        let [lastRowByQuery, meta] = await sequelize.query(queryGetLastRow)
        let dateNow = new Date().getFullYear() + "" + (new Date().getMonth() + 1) + "" + new Date().getDate()

        const data = {
            "order_name": dateNow + "#" + lastRowByQuery[0].nextval,
            "order_created_on": new Date(),
            order_status,
            order_subtotal,
            order_shipping,
            order_discount,
            order_tax,
            order_total_due,
            order_total_qty,
            order_watr_numbers,
            order_is_receive,
            order_acco_id,
            order_stat_name,
            order_weight
        }
        let createOrder = await orders.create(data)
        console.log(createOrder)
        res.json(createOrder)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const finishOrder = async (req, res, next) => {

    const { order_name } = req.body
    const { orders } = req.context.models
    const queryGetOrderDetail = "select orders.order_total_due, product.prod_acco_id from orders join orders_line_items on order_name = orit_order_name" +
        " join product on orit_prod_id=prod_id where order_name='" + order_name + "'";

    try {
        let [orderDetail, meta] = await sequelize.query(queryGetOrderDetail)
        req.body.seller_acco_id = orderDetail[0].prod_acco_id
        let { wale_id_increase, wale_id_decrease, nextTransUser } = await preFinishOrderData(req)
        req.body.total_amount = orderDetail[0].order_total_due

        let preparedData = await prepareTransaction(req, {
            wale_id_decrease, wale_id_increase, nextTransUser
        })

        let { dataTransactionCredit, dataTransactionDebit } = preparedData

        dataTransactionDebit.watr_numbers = wale_id_decrease + "-" + wale_id_increase + "-" + nextTransUser
        dataTransactionCredit.watr_numbers = wale_id_decrease + "-" + wale_id_increase + "-" + nextTransUser

        let createTrans = await createTransaction(req, {
            wale_id_decrease,
            wale_id_increase,
            total_amount: orderDetail[0].order_total_due,
            dataTransactionCredit,
            dataTransactionDebit
        })
        await orders.update({ order_stat_name: "CLOSED" }, { where: { order_name } })
        res.send(createTrans)
    } catch (error) {
        console.log(error)
    }
}

const getOrderedProduct = async (req, res, next) => {
    const { acco_id } = req.params
    let queryGetOrderedProduct = "select * from orders_line_items join product on orit_prod_id = prod_id join orders on orit_order_name=order_name where prod_acco_id='" + acco_id + "' AND orders.order_stat_name='PAID' OR orders.order_stat_name='SHIPPING'";
    try {
        let [result, meta] = await sequelize.query(queryGetOrderedProduct)
        res.send(result)
    } catch (error) {
        res.send(error)
    }
}

const updateOrder = async (req, res, next) => {
    const { order_name } = req.body
    const { orders } = req.context.models
    try {
        await orders.update({ order_stat_name: 'SHIPPING' }, { where: { order_name } })
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
    }
}

const cancelOrder = async (req, res, next) => {
    let MPCOMM = 9999;
    console.log(req.body)
    const { order_name } = req.body
    const { orders, walletTransaction, wallet } = req.context.models

    try {
        let getOrder = await orders.findOne({ where: { order_name } })

        switch (getOrder.order_stat_name) {
            case "SHIPPING":
                res.send({
                    error: true,
                    message: "Order sudah dalam status Shipping"
                })
                break;

            case "PAID":
                let watr_numbers = await getOrder.order_watr_numbers
                let getWatr = await walletTransaction.findOne({ where: { watr_numbers } })
                let wale_id = getWatr.watr_numbers.split("-")[0]
                let total_amount = getWatr.watr_debet

                req.body.acco_id = getOrder.order_acco_id
                req.body.total_amount = total_amount
                console.log(req.body)
                let preDataOpt = { wale_id_increase: wale_id, wale_id_decrease: MPCOMM }
                let { dataTransactionCredit, dataTransactionDebit } = await prepareCancelTransaction(req, preDataOpt)

                dataTransactionCredit.watr_numbers = MPCOMM + "-" + wale_id +"-"+ getWatr.watr_numbers.split("-")[2] + "-ret"
                dataTransactionDebit.watr_numbers = MPCOMM + "-" + wale_id + "-" + getWatr.watr_numbers.split("-")[2] + "-ret"

                const option = {
                    wale_id_decrease: MPCOMM,
                    wale_id_increase: wale_id,
                    total_amount,
                    dataTransactionCredit,
                    dataTransactionDebit
                }
                await createTransaction(req, option)
                await orders.update({ order_stat_name: "CANCELLED" }, { where: { order_name } })
                res.sendStatus(200)
                break;

            case "CHECKOUT":
                await orders.update({ order_stat_name: "CANCELLED" }, { where: { order_name } })
                res.sendStatus(200)
                break;

            default:
                break;
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

export { getOrders, createOrder, cancelOrder, getOrderedProduct, updateOrder, finishOrder }
import { sequelize } from '../models/index'
const getOrders = async (req, res, next) => {
    try {
        const { order_acco_id } = req.params
        const { orders } = req.context.models
        const gotOrders = await orders.findAll({ where: { order_acco_id }})
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
        const { order_acco_id } = req.params
        const { orders } = req.context.models
        const queryGetLastRow = "select nextval('order_name_seq')";
        let [lastRowByQuery,meta] = await sequelize.query(queryGetLastRow)
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
        res.json(createOrder)  
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const updateOrder = (req,res,next) => {
  try {
      
  } catch (error) {
      
  }
}

const cancelOrder = async (req,res,next) => {
    let wale_id_mpcomm = 9999;
    const {order_name} = req.body
    const {orders,walletTransaction} = req.context.models
    let getOrder = await orders.findOne({where:{order_name}})

    if(getOrder.order_stat_name === "SHIPPING"){
        res.send({
            error:true,
            message:"Order sudah dalam status Shipping"
        })

    }else{
        let watr_numbers = getOrder.order_watr_numbers
        let getWatr = await walletTransaction.findOne({where:{watr_numbers}})
        let wale_id = getWatr.watr_numbers.split("-")[0]
        let total_amount = getWatr.watr_debet

        let datransCreditToUser = {
            watr_numbers:  9999 + "-"+wale_id+"-"+ lastTransNo,
            watr_debet: 0,
            watr_date: new Date(),
            watr_credit: total_amount,
            watr_acc_target: wale_id,
            watr_wale_id: 9999,
            watr_paty_name: "TFC",
            order_name
        }

        await wallet.increment('wale_saldo', { by: total_amount, where: { wale_id } })
        let result = await createTransaction(walletTransaction, dataTransaction)
        await wallet.decrement('wale_saldo', { by: total_amount, where: { wale_id : wale_id_mpcomm }})
        await walletTransaction.create(datransCreditToUser)
        console.log(getWatr)
        res.sendStatus(200)
    }
}

export { getOrders, createOrder, cancelOrder }
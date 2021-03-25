import { sequelize } from '../models/index'
const getOrders = async (req, res, next) => {
    try {
        const { order_acco_id } = req.params
        const { orders } = req.context.models
        const gotOrders = await orders.findAll({ where: [{ order_acco_id },{order_stat_name:'CHECKOUT'}]})
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
        order_acco_id,
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
        console.log(createOrder)
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

export { getOrders, createOrder }
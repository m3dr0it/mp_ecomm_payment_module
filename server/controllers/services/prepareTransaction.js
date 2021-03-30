import { getLastTransWallet } from './getLastTransWallet'

const preData = async (req) => {
    const { wallet } = req.context.models
    const { acco_id } = req.body
    const wale_id_mpcomm = 9999;
    const walletBuyer = await wallet.findOne({ where: { wale_acco_id: acco_id } })
    let nextTransUser = await getLastTransWallet(walletBuyer.wale_id)

    return { wale_id_increase: wale_id_mpcomm, wale_id_decrease: walletBuyer.wale_id, nextTransUser }
}

const preFinishOrderData = async (req) => {
    const { wallet } = req.context.models
    const { acco_id } = req.body
    const wale_id_mpcomm = 9999;
    const walletBuyer = await wallet.findOne({ where: { wale_acco_id: acco_id } })
    let nextTransUser = await getLastTransWallet(walletBuyer.wale_id)

    return { wale_id_increase: wale_id_mpcomm, wale_id_decrease: walletBuyer.wale_id, nextTransUser }
}

const prepareTransaction = async (req, { wale_id_decrease, wale_id_increase, nextTransUser }) => {
    const { total_amount } = req.body || 0
    const { order_name } = req.body || null

    const dataTransactionDebit = {
        watr_debet: total_amount,
        watr_date: new Date(),
        watr_credit: 0,
        watr_acc_target: wale_id_increase,
        watr_wale_id: wale_id_decrease,
        watr_paty_name: "TTC",
        order_name
    }

    const dataTransactionCredit = {
        watr_debet: 0,
        watr_date: new Date(),
        watr_credit: total_amount,
        watr_acc_target: wale_id_decrease,
        watr_wale_id: wale_id_increase,
        watr_paty_name: "TFC",
        order_name
    }

    return { dataTransactionCredit, dataTransactionDebit, nextTransUser }
}

const prepareCancelTransaction = async (req, { wale_id_decrease, wale_id_increase, nextTransUser }) => {
    const { total_amount } = req.body || 0
    const { order_name } = req.body || null

    console.log(wale_id_decrease)
    console.log(wale_id_increase)

    const dataTransactionDebit = {
        watr_debet: total_amount,
        watr_date: new Date(),
        watr_credit: 0,
        watr_acc_target: wale_id_increase,
        watr_wale_id: wale_id_decrease,
        watr_paty_name: "TTC",
        order_name
    }

    const dataTransactionCredit = {
        watr_debet: 0,
        watr_date: new Date(),
        watr_credit: total_amount,
        watr_acc_target: wale_id_decrease,
        watr_wale_id: wale_id_increase,
        watr_paty_name: "TFB",
        order_name
    }

    return { dataTransactionCredit, dataTransactionDebit, nextTransUser }
}

export { prepareTransaction, prepareCancelTransaction, preData }
import jsonwebtoken, { JsonWebTokenError } from 'jsonwebtoken'
import easyinvoice from "easyinvoice";
import { response } from 'express';
import { createNewTransOrder, createNewTransBilling, createNewTransAdv, createTransaction } from './services/createNewTransaction'
import { prepareTransaction,preData } from './services/prepareTransaction'

const getWalletTransactionByAccount = (req, res, next) => {
    const { acco_id } = req.params
    const { wallet, walletTransaction } = req.context.models
    walletTransaction.findAll({
        include: { model: wallet, where: { wale_acco_id: acco_id } }, order: [['watr_date', 'ASC']]
    }).then((watr) => {
        return res.send(watr)
    }).catch((err) => {
        return res.send(err.message)
    });
}

const insertWalletTransaction = (req, res, next) => {
    const { watr_numbers, watr_debet, watr_credit, watr_acc_target, watr_wale_id, watr_paty_name } = req.body
    const watr_date = Date.now()
    req.context.models.walletTransaction.create({
        watr_numbers, watr_date, watr_debet, watr_credit, watr_acc_target, watr_wale_id, watr_paty_name
    }).then((result) => {
        return res.send(result)
    }).catch((err) => {
        return res.send(err.message)
    });
}

const updateWalletTransaction = (req, res, next) => {
    const watr_id = req.params.watr_id
    const { watr_numbers, watr_debet, watr_credit, watr_acc_target, watr_wale_id, watr_paty_name } = req.body
    req.context.models.walletTransaction.update({
        watr_numbers, watr_debet, watr_credit, watr_acc_target, watr_wale_id, watr_paty_name
    }, { where: { watr_id } }).then((result) => {
        return res.send(result)
    }).catch((err) => {
        return res.send(err.message)
    });
}

const deleteWalletTransaction = (req, res, next) => {
    const { watr_id } = req.body
    req.context.models.walletTransaction.destroy({ where: { watr_id } }).then((result) => {
        return res.sendStatus(200)
    }).catch((err) => {
        return res.send(err.message)
    });
}

const newTransaction = async (req, res, next) => {
    const { transaction_type, payment_by, order_name, bacc_id, total_amount } = req.body || null
    const { orders } = req.context.models
    const MPCOMM = 9999
    let preDataOpt = await preData(req)
    let preparedData = {}
    try {
        let { dataTransactionCredit, dataTransactionDebit, nextTransUser } = await prepareTransaction(req,preDataOpt)
        switch (transaction_type) {
            case "order":
                preparedData = await createNewTransOrder(dataTransactionCredit, dataTransactionDebit, { payment_by, MPCOMM, nextTransUser, bacc_id })
                break;

            case "billing":
                const { vendor } = req.body
                preparedData = await createNewTransBilling(dataTransactionCredit, dataTransactionDebit, { payment_by, vendor, nextTransUser, bacc_id })
                break;

            case "advertising":
                preparedData = await createNewTransAdv(dataTransactionCredit, dataTransactionDebit, { payment_by, MPCOMM, nextTransUser, bacc_id })
                break;

            default:
                console.log("transaction type not found")
                break;  
        }
        await createTransaction(
            req,
            {
                wale_id_decrease:dataTransactionDebit.watr_wale_id,
                wale_id_increase:MPCOMM,
                total_amount,
                dataTransactionCredit: preparedData.dataTransactionCredit,
                dataTransactionDebit: preparedData.dataTransactionDebit
            })

        await orders.update({
            order_stat_name: "PAID",
            order_watr_numbers: dataTransactionDebit.watr_numbers
        }, { where: { order_name } })

        res.send({ watr_numbers: dataTransactionDebit.watr_numbers })

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const addSaldo = async (req, res, next) => {
    const { acco_id, total_amount, wale_id, bank_acc_number, order_name } = req.body
    const { wallet, walletTransaction } = req.context.models
    const walletBuyer = await wallet.findOne({ where: { wale_acco_id: acco_id }, raw: true })
    const walletTransBuyer = await walletTransaction.findAll({ where: { watr_wale_id: walletBuyer.wale_id } })
    let lastTransNo = walletTransBuyer.length + 1
    let getLastTransQuery = "select nextval(wallet_wale_id_seq_" + wale_id + ")";

    let dataTransaction = {
        watr_numbers: bank_acc_number + "-" + wale_id + "-" + lastTransNo,
        watr_debet: 0,
        watr_date: new Date(),
        watr_credit: total_amount,
        watr_acc_target: '',
        watr_wale_id: wale_id,
        watr_paty_name: "TFB",
        order_name
    }
    try {
        let addSaldo = await wallet.increment('wale_saldo', { by: total_amount, where: { wale_acco_id: acco_id } })
        let createTrans = await createTransaction(walletTransaction, dataTransaction)
        console.log(createTrans)
        return res.send(createTrans)
    } catch (error) {
        res.send(error)
    }
}

const verifyTrans = async (req, res, next) => {
    const { acco_id, pin_number } = req.body
    const { wallet } = req.context.models
    try {
        let walletUser = await wallet.findOne({ where: { wale_acco_id: acco_id }, raw: true })
        console.log(walletUser.wale_pin_number)
        console.log(walletUser)
        let verified = Number(pin_number) === walletUser.wale_pin_number
        if (verified) {
            next()
        } else {
            return res.send(verified)
        }
    } catch (error) {
        res.send(error)
    }
}

const getBillingToken = async (req, res, next) => {
    let token = jsonwebtoken.sign(req.body, 'secret', { expiresIn: '2h' })
    return res.send(token)
}

const transactionBankTransfer = async (req, res, next) => {
    const { token } = req.params
    const dataToken = jsonwebtoken.decode(token)

    try {
        let valid = jsonwebtoken.verify(token, 'secret')
        console.log(valid)

        req.body = dataToken
        next()
    } catch (error) {
        res.send(error)
    }

}

export {
    transactionBankTransfer,
    getWalletTransactionByAccount,
    insertWalletTransaction,
    updateWalletTransaction,
    deleteWalletTransaction,
    newTransaction,
    addSaldo,
    verifyTrans,
    getBillingToken
}
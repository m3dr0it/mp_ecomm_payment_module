import jsonwebtoken, { JsonWebTokenError } from 'jsonwebtoken'
import easyinvoice from "easyinvoice";
import { response } from 'express';

const getWalletTransactionByAccount = (req, res, next) => {
    const { acco_id } = req.params
    const { wallet, walletTransaction } = req.context.models
    walletTransaction.findAll({
        include: { model: wallet, where: { wale_acco_id: acco_id }},order:[['watr_date','ASC']]
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
    console.log("test")
    const wale_id_mpcomm = 9999;
    const { acco_id, total_amount, order_name, transaction_type, payment_by, vendor, bacc_id } = req.body ||null
    console.log(payment_by)
    const { wallet, walletTransaction, bankAccount, orders } = req.context.models
    console.log(req.body)
    console.log(bacc_id)

    try {
        const walletBuyer = await wallet.findOne({ where: { wale_acco_id: acco_id }, raw: true })
        const walletTransBuyer = await walletTransaction.findAll({ where: { watr_wale_id: walletBuyer.wale_id } })
        let lastTransNo = walletTransBuyer.length + 1

        let dataTransaction = {
            watr_numbers: walletBuyer.wale_id + "-" + wale_id_mpcomm + "-" + lastTransNo,
            watr_debet: total_amount,
            watr_date: new Date(),
            watr_credit: 0,
            watr_acc_target: 9999,
            watr_wale_id: walletBuyer.wale_id,
            watr_paty_name: "TTC",
            order_name
        }

        let dataTransactionCredit = {
            watr_numbers: walletBuyer.wale_id + "-" + wale_id_mpcomm + "-" + lastTransNo,
            watr_debet: 0,
            watr_date: new Date(),
            watr_credit: total_amount,
            watr_acc_target: walletBuyer.wale_id,
            watr_wale_id: 9999,
            watr_paty_name: "TFC",
            order_name
        }
        switch (transaction_type) {
            case "order":
                console.log("order hitted")

                if (payment_by == "transfer_bank") {
                    const getBacc = await bankAccount.findOne({ where: { bacc_id }, raw: true })
                    dataTransaction.watr_numbers = getBacc.bacc_acc_number + "-" + wale_id_mpcomm + "-" + lastTransNo
                } else if (payment_by == "wallet") {
                    dataTransaction.watr_numbers = walletBuyer.wale_id + "-" + wale_id_mpcomm + "-" + lastTransNo
                }
                break;

            case "billing":
                if (payment_by == "transfer_bank") {
                    const getBacc = await bankAccount.findOne({ where: { bacc_id }, raw: true })
                    dataTransaction.watr_numbers = getBacc.bacc_acc_number + "-" + vendor + "-" + lastTransNo
                } else if (payment_by == "wallet") {
                    dataTransaction.watr_numbers = walletBuyer.wale_id + "-" + vendor + "-" + lastTransNo
                }
                break;

            case "advertisement":
                dataTransaction.watr_numbers = walletBuyer.wale_id + "-" + wale_id_mpcomm + "-" + lastTransNo
                console.log("advertisement")
                break;

            default:
                console.log("transaction type not found")
                break;

        }

        const createInvoice = (req,res,next) => {
          res.send("creating invoice")
        }

        console.log(dataTransaction)

        await wallet.decrement('wale_saldo', { by: total_amount, where: { wale_acco_id: acco_id } })
        let result = await createTransaction(walletTransaction, dataTransaction)
        await wallet.increment('wale_saldo', { by: total_amount, where: { wale_acco_id: wale_id_mpcomm } })
        await createTransaction(walletTransaction, dataTransactionCredit)

        await orders.update({
            order_stat_name:"PAID",
            order_watr_numbers:dataTransaction.watr_numbers
        },{where:{order_name}})


        if (payment_by == "transfer_bank") {
            res.send({
                payment_by:"transfer_bank",
                bacc_id:bacc_id,
                message:"Pembayaran Berhasil"
            })
        } else if (payment_by == "wallet") {
            console.log(result.watr_id)
            res.send({watr_numbers:dataTransaction.watr_numbers})
        }else{
            res.send({watr_numbers:dataTransaction.watr_numbers})
        }
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const createTransaction = async (walletTransaction, dataTransaction) => {
    return await walletTransaction.create(dataTransaction)
}

const addSaldo = async (req, res, next) => {
    const { acco_id, total_amount, wale_id, bank_acc_number, order_name } = req.body
    const { wallet, walletTransaction } = req.context.models
    const walletBuyer = await wallet.findOne({ where: { wale_acco_id: acco_id }, raw: true })
    const walletTransBuyer = await walletTransaction.findAll({ where: { watr_wale_id: walletBuyer.wale_id } })
    let lastTransNo = walletTransBuyer.length + 1

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
        let valid = jsonwebtoken.verify(token,'secret')
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
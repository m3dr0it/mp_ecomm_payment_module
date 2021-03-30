import { getLastTransWallet } from './getLastTransWallet'

const createNewTransOrder = async (dataTransactionCredit, dataTransactionDebit, option) => {
    const { payment_by, wale_id_mpcomm, nextTransUser, bacc_id } = option
    console.log("order hitted")
    const {bankAccount} = req.context.models
    if (payment_by == "transfer_bank") {
        const getBacc = await bankAccount.findOne({ where: { bacc_id }, raw: true })
        dataTransactionDebit.watr_numbers = getBacc.bacc_acc_number + "-" + wale_id_mpcomm + "-" + nextTransUser
    } else if (payment_by == "wallet") {
        dataTransactionDebit.watr_numbers = dataTransactionDebit.watr_wale_id + "-" + dataTransactionDebit.watr_acc_target + "-" + nextTransUser
        dataTransactionCredit.watr_numbers = dataTransactionCredit.watr_wale_id + "-" + dataTransactionCredit.watr_acc_target + "-" + nextTransUser
    }
    return { dataTransactionCredit, dataTransactionDebit }
}

const createNewTransBilling = async (dataTransactionCredit, dataTransactionDebit, option) => {
    console.log("Billing hitted")
    const { payment_by, vendor, nextTransUser } = option
    if (payment_by == "transfer_bank") {
        const getBacc = await bankAccount.findOne({ where: { bacc_id }, raw: true })
        dataTransactionCredit.watr_numbers = getBacc.bacc_acc_number + "-" + vendor + "-" + nextTransUser
    } else if (payment_by == "wallet") {
        dataTransactionDebit.watr_numbers = dataTransactionDebit.watr_wale_id + "-" + vendor + "-" + nextTransUser
    }
    return { dataTransactionCredit, dataTransactionDebit }
}

const createNewTransAdv = async (dataTransactionCredit, dataTransactionDebit, option) => {
    console.log("adv hitted")
    const { payment_by, nextTransUser, bacc_id } = option
    if (payment_by == "transfer_bank") {
        const getBacc = await bankAccount.findOne({ where: { bacc_id }, raw: true })
        dataTransactionDebit.watr_numbers = getBacc.bacc_acc_number + "-" + vendor + "-" + nextTransUser
    } else if (payment_by == "wallet") {
        dataTransactionDebit.watr_numbers = dataTransactionDebit.watr_wale_id + "-" + dataTransactionDebit.watr_acc_target + "-" + nextTransUser
        dataTransactionCredit.watr_numbers = dataTransactionCredit.watr_wale_id + "-" + dataTransactionCredit.watr_acc_target + "-" + nextTransUser
    }
    return { dataTransactionCredit, dataTransactionDebit }
}

const createTransaction = async (
    req,
    {
        wale_id_decrease,
        wale_id_increase,
        total_amount,
        dataTransactionCredit,
        dataTransactionDebit
    }) => {


    const { walletTransaction, wallet } = req.context.models
    console.log(wale_id_decrease)
    //decrement wallet user/buyer
    await wallet.decrement('wale_saldo', { by: total_amount, where: { wale_id: wale_id_decrease } })
    const result = await walletTransaction.create(dataTransactionDebit)

    //increment wallet bersama
    await wallet.increment('wale_saldo', { by: total_amount, where: { wale_id: wale_id_increase } })
    await walletTransaction.create(dataTransactionCredit)
    return result
}

export { createNewTransOrder, createNewTransBilling, createNewTransAdv, createTransaction }
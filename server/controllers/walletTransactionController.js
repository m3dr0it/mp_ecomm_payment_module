const getWalletTransactionByAccount = (req,res,next) => {
    const {acco_id} = req.params
    const {wallet,walletTransaction} = req.context.models
    walletTransaction.findAll({
        include:{model:wallet,where:{wale_acco_id:acco_id}}
    }).then((watr) => {
      return res.send(watr)
  }).catch((err) => {
      return res.send(err.message)
  });
}

const insertWalletTransaction = (req,res,next) => {
    const {watr_numbers,watr_debet,watr_credit,watr_acc_target,watr_wale_id,watr_paty_name} = req.body
    const watr_date = Date.now()
    req.context.models.walletTransaction.create({
        watr_numbers,watr_date,watr_debet,watr_credit,watr_acc_target,watr_wale_id,watr_paty_name
    }).then((result) => {
        return res.send(result)
    }).catch((err) => {
        return res.send(err.message)
    });
}

const updateWalletTransaction = (req,res,next) => {
    const watr_id = req.params.watr_id
    const {watr_numbers,watr_debet,watr_credit,watr_acc_target,watr_wale_id,watr_paty_name} = req.body
    const watr_date = Date.now()
    req.context.models.walletTransaction.update({
        watr_numbers,watr_date,watr_debet,watr_credit,watr_acc_target,watr_wale_id,watr_paty_name
    },{where:{watr_id}}).then((result) => {
        return res.send(result)
    }).catch((err) => {
        return res.send(err.message)
    });
}

const deleteWalletTransaction = (req,res,next) => {
  const {watr_id} = req.body
  req.context.models.walletTransaction.destroy({where:{watr_id}}).then((result) => {
      return res.sendStatus(200)
  }).catch((err) => {
      return res.send(err.message)
  });
}

const newTransaction = async (req,res,next) => {
    const wale_id_mpcomm = 9999;
    const {acco_id,total_amount,order_name,transaction_type}=req.body
    const {wallet,walletTransaction} = req.context.models
    
    const walletBuyer = await wallet.findOne({where:{wale_acco_id:acco_id},raw:true})
    let dataTransaction = {
        watr_numbers: walletBuyer.wale_id+"-"+wale_id_mpcomm,
        watr_date : Date.now(),
        watr_debet: total_amount,
        watr_credit:0,
        watr_acc_target:'',
        watr_wale_id:walletBuyer.wale_id,
        watr_paty_name:"TTC",
        order_name
    }

    switch(transaction_type){
        case "order"||"Order":{
            console.log("order hitted")
            dataTransaction.watr_numbers = walletBuyer.wale_id+"-"+wale_id_mpcomm
            dataTransaction.watr_acc_target = wale_id_mpcomm
            break;
        }
        case "billing":{
            const {vendor} = req.body
            dataTransaction.watr_numbers = walletBuyer.wale_id+"-"+vendor
            dataTransaction.watr_acc_target = vendor
            console.log(vendor)
            break;
        }
        case "advertisement":{
            dataTransaction.watr_numbers = walletBuyer.wale_id+"-"+wale_id_mpcomm
            dataTransaction.watr_acc_target = wale_id_mpcomm
            console.log("advertisement")
            break;  
        }
        default:{
            console.log("transaction type not found")
            break;
        }
    }
    await createTransaction(walletTransaction,dataTransaction)
    await wallet.decrement('wale_saldo',{by:total_amount,where:{wale_acco_id:acco_id}})
    await wallet.increment('wale_saldo',{by:total_amount,where:{wale_acco_id:wale_id_mpcomm}})
    res.send(dataTransaction.watr_numbers)
}

const createTransaction = async (walletTransaction,dataTransaction) => {
    return await walletTransaction.create(dataTransaction)
}

const addSaldo = async (req,res,next) => {
    const {acco_id,amount} = req.params
    const {wallet} = req.context.models
    let addSaldo = await wallet.increment('wale_saldo',{by:amount,where:{wale_acco_id:acco_id}})
    return res.send(addSaldo)
}

export {
    getWalletTransactionByAccount,
    insertWalletTransaction,
    updateWalletTransaction,
    deleteWalletTransaction,
    newTransaction,
    addSaldo
}
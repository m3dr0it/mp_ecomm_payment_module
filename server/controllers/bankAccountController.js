const getBankAccountByAccount = (req,res,next) => {
    const {acco_id} = req.params
  req.context.models.bankAccount.findAll({where:{bacc_acco_id:acco_id}}).then((bankAccount) => {
      return res.send(bankAccount)
  }).catch((err) => {
      return res.send(err.message)
  });
}

const insertBankAccount = (req,res,next) => {
    const {bacc_owner,bacc_acc_number,bacc_saldo,bacc_acco_id,bacc_bank_id} = req.body
    req.context.models.bankAccount.create({bacc_owner,bacc_acc_number,bacc_saldo,bacc_acco_id,bacc_bank_id})
    .then((result) => {
        return res.send(result)
    }).catch((err) => {
        return res.send(err.message)
    });
}

const updateBankAccount = (req,res,next) => {
    const bacc_id = req.params.bacc_id
    const {bacc_owner,bacc_acc_number,bacc_saldo,bacc_acco_id,bacc_bank_id} = req.body
    req.context.models.bankAccount.update({bacc_owner,bacc_acc_number,bacc_saldo,bacc_acco_id,bacc_bank_id},{
        where:{bacc_id}
    }).then((result) => {
        return res.send(result)
    }).catch((err) => {
        return res.send(err.message)
    });
}

const deleteBankAccount = (req,res,next) => {
    const bacc_id = req.params.bacc_id
    req.context.models.bankAccount.destroy({where:{bacc_id}})
    .then((result) => {
        return res.sendStatus(200)
    }).catch((err) => {
        return res.send(err.message)
    });
}

const getBankAccountAndBank = (req,res,next) => {
    console.log("in controller")
    const bank = req.context.models.bank
    const account = req.context.models.account
    console.log(account)
    const bankAccount = req.context.models.bankAccount
    const bacc_id = req.params.bacc_id
    req.context.models.bankAccount.findAll({
        include:[
            {model:account},
            {model:bank}
        ]}).then((result) => {
        return res.send(result)
    }).catch((err) => {
        return res.send(err)
    });
}

export {
    getBankAccountByAccount,
    insertBankAccount,
    updateBankAccount,
    deleteBankAccount,
    getBankAccountAndBank
}
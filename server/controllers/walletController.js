const getWalletByAccount = (req,res,next) => {
  const acco_id = req.params.acco_id
    req.context.models.wallet.findAll({where:{wale_acco_id:acco_id}}).then((wallet) => {
        return res.send(wallet)
    }).catch((err) => {
        return res.send(err.message)
    });
}

const getWalletPaymentType = (req,res,next) => {
  console.log("hitted")
  const {wallet,walletTransaction,paymentType,account} = req.context.models
  walletTransaction.findAll({
    include:{
      model:wallet,
      include:{
      model:account
    }
  }}).then((result) => {
    return res.send(result)
  }).catch((err) => {
    return res.send(err)
  });
}

const getSaldoAccount = async (req,res,next) => {
  console.log("hitted")
    const {acco_id} = req.params
    const {wallet} = req.context.models
    const getSaldo = await wallet.findAll({where:{wale_acco_id:acco_id}})
    return res.send(getSaldo)
}

const insertWallet = (req,res,next) => {
    const {wale_saldo,wale_pin_number,wale_acco_id} = req.body
    const wale_created_on = Date.now()
    req.context.models.wallet.create({wale_saldo,wale_created_on,wale_pin_number,wale_acco_id}).then((result) => {
        return res.send(result)
    }).catch((err) => {
        return res.send(err.message)
    });
}

const updateWallet = (req,res,next) => {
  const wale_id = req.params.wale_id
  const {wale_saldo,wale_pin_number,wale_acco_id} = req.body
  const wale_created_on = Date.now()
  req.context.models.wallet.update({
    wale_saldo,wale_pin_number,wale_acco_id,wale_created_on
  },{where:{
      wale_id
    }}).then((result) => {
      return res.send(result)
  }).catch((err) => {
      return res.send(err)
  });
}

const deleteWallet = (req,res,next) => {
  const wale_id = req.params.wale_id
    req.context.models.wallet.destroy({wale_id}).then((result) => {
      return res.send(result)
  }).catch((err) => {
      return res.send(err)
  });
}



//coba coba
const getCart = (req,res,next) => {
  const {cart,cartLineItems} = req.context.models
  cart.findAll({
    include:{model:cartLineItems},raw:true
  }).then((result) => {
    console.log(result)
    return res.send(result)
  }).catch((err) => {
    console.log(err)
    return res.send(err)
  });
}

const getProdIdAndAccount = async (req,res,) => {
  console.log("hitted")
  const {cart,cartLineItems,product,account} = req.context.models
  cart.findAll({
    include:{model:cartLineItems,
      include:{model:product
      }
    },
    raw:true
  }).then((result) => {
    console.log(result)
    return res.send(result)
  }).catch((err) => {
    return res.send(err)
  });
}

const defineOrder = (req,res,next) => {
  const cart = req.body
  const {order} = req.context.models
}

export {getProdIdAndAccount,getCart,getWalletByAccount,insertWallet,updateWallet,deleteWallet,getSaldoAccount,getWalletPaymentType}
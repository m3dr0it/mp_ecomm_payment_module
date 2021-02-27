const getPaymentType = (req,res,next) => {
  req.context.models.paymentType.findAll({}).then((result) => {
      return res.send(result)
  }).catch((err) => {
      return res.send(err.message)
  });
}

const insertPaymentType = (req,res,next) => {
    const {paty_name,paty_desc} = req.body
  req.context.models.paymentType.create({paty_name,paty_desc}).then((result) => {
      return res.send(result)
  }).catch((err) => {
      return res.send(err.message)
  });
}

const updatePaymentType = (req,res,next) => {
    const paty_name = req.params.paty_name
    const {paty_desc} = req.body
  req.context.models.paymentType.update({paty_name,paty_desc},{where:{paty_name}}).then((result) => {
      return res.send(result)
  }).catch((err) => {
      return res.send(err)
  });
}

const deletePaymentType = (req,res,next) => {
  const {paty_name} = req.body
  req.context.models.paymentType.destroy({where:{paty_name}}).then((result) => {
      return res.sendStatus(200)
  }).catch((err) => {
      return res.send(err.message)
  });
}

export {getPaymentType,insertPaymentType,updatePaymentType,deletePaymentType}
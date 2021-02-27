const getBank = (req,res,next) => {
    req.context.models.bank.findAll({}).then((result) => {
        return res.send(result)
    }).catch((err) => {
        return res.send(err)
    });
}

const insertBank = (req,res,next) => {
    console.log(req.body)
  const {bank_id,bank_name} = req.body
    req.context.models.bank.create({
        bank_id,bank_name
        }).then((result) => {
            return res.send(result)
        }).catch((err) => {
            return res.send(err)
        });
}

const updateBank = (req,res,next) => {
    const bank_id = req.params.bank_id
    const {bank_name} = req.body
    req.context.models.bank.update({
        bank_name
    },{where:{
        bank_id
    }}).then((result) => {
        return res.send(result)
    }).catch((err) => {
        return res.send(err)
    });
}

const deleteBank = (req,res,next) => {
    const bank_id = req.params.bank_d
    req.context.models.bank.destroy({
        where:{
            bank_id
        }
    }).then((result) => {
        console.log(result)
        return res.sendStatus(200)
    }).catch((err) => {
        return res.send(err)
    });
  }

export {getBank,insertBank,updateBank,deleteBank}
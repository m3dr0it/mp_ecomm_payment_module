import {sequelize} from '../../models/index'
const getLastTransWallet = async (wale_id) => {
    const getLastTransQuery = "select nextval('wallet_wale_id_seq_"+wale_id+"')";
    let [lastTrans,meta] = await sequelize.query(getLastTransQuery);
    return lastTrans[0].nextval
}

export {getLastTransWallet}
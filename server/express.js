import 'dotenv/config'
import config from '../config/config'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
// #1. add this script to import model dan routes
import models from './models/index';
import routes from './routes/index';

import { sequelize } from './models/index'
const app = express()
import devBundle from './devBundle'

const CURRENT_WORKING_DIR = process.cwd()

//comment script dibawah before building for production
//devBundle.compile(app)

// parse body params and attache them to req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
// secure apps by setting various HTTP headers
app.use(compress())
// enable CORS - Cross Origin Resource Sharing
app.use(cors());
// #middleware
app.use(async (req, res, next) => {
    req.context = {models};
    next();
});
app.use(function(req, res, next) {  
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); 
// app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))
// #2 add this script when you add other route
app.use('/api/orders',routes.orders);

app.use('/api/wallet',routes.wallet)
app.use('/api/bank',routes.bank)
app.use('/api/walletTransaction',routes.walletTransaction)
app.use('/api/paymentType',routes.paymentType)
app.use('/api/bankAccount',routes.bankAccount)
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

 

// Catch unauthorised errors
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({"error" : err.name + ": " + err.message})
  }else if (err) {
    res.status(400).json({"error" : err.name + ": " + err.message})
    console.log(err)
  }
})

app.use((req,res) => {
  res.sendStatus(404)
})

const dropDatabaseSync = false;
sequelize.sync({ force: dropDatabaseSync }).then((result) => {
  if (dropDatabaseSync) {
    console.log("Connection established, but do nothing")
  }
}).catch((err) => {
  console.log(err)
});

app.listen(config.port, () =>
  console.info('Server started on port %s.', config.port)
)

export default app
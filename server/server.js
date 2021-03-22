import config from './../config/config'
import { sequelize } from './models/index';
import app from './express'

// Connection URL
const dropDatabaseSync = false;

try {
  sequelize.sync({ force: dropDatabaseSync }).then((result) => {
    if (dropDatabaseSync) {
      console.log("Connection established, but do nothing")
    }  
  }).catch((err) => {
    console.log(err)
  });
} catch (error) {
  console.log(error)
}

app.listen(config.port, () =>
  console.info('Server started on port %s.', config.port)
)
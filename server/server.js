import config from './../config/config'
import { sequelize } from './models/index';
import app from './express'

// Connection URL
const dropDatabaseSync = false;
sequelize.sync({ force: dropDatabaseSync }).then(async () => {
  if (dropDatabaseSync) {
    console.log("Connection established, but do nothing")
  }

  app.listen(config.port, () =>
  console.info('Server started on port %s.', config.port),
  );
});
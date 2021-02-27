const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  db_name : "mpcomm",
  db_username : "postgres",
  db_password: "admin",
  db_remote_host : '192.168.100.254'
}
export default config
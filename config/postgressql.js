/******************************Credenciales para acceder a PostgresSql***********************************/
require('dotenv').config()
const credentials = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  allowExitOnIdle: process.env.ALLOWEXITTOIDLE,
}
module.exports = credentials

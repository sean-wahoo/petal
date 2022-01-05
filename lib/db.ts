import mysql from 'mysql2/promise'
import bluebird from 'bluebird'

const connection = await mysql.createConnection({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  password: process.env.DBPASSWORD,
  database: process.env.DBNAME,
  port: 3306,
  Promise: bluebird,
  rowsAsArray: true,
})

export default connection

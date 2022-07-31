import { connect as mongoose } from 'mongoose'
import { config as dotenv } from 'dotenv'

dotenv()

const {
  MONGODB_USERNAME: username,
  MONGODB_PASSWORD: password,
  MONGODB_DBNAME: dbName
} = process.env

const uri = `mongodb+srv://${username}:${password}@cluster0.jdepz.mongodb.net/${dbName}?retryWrites=true&w=majority`

const connect = () =>
  // @ts-ignore
  mongoose(uri, { useNewUrlParser: true, useUnifiedTopology: true })

// console.log(uri)

export { dotenv }
export default connect

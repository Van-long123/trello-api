/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1/index'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
const START_SERVER = () => {
  const app = express()

  //Xử lý CORS
  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/v1', APIs_V1)

  //Middleware xử lý lỗi tập chung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_NAME, () => {
    console.log(`I am ${env.AUTHOR} running at ${ env.APP_NAME }:${ env.APP_PORT }/`)
  })

  exitHook(() => {
    console.log('Server is shutting down...')
    CLOSE_DB()
    console.log('Disconnected from MongoDB Cloud Atlas')
  })
}
// IIFE trong JavaScript: Hàm được gọi thực thi ngay lập tức
(async () => {
  try {
    await CONNECT_DB()
    console.log('Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// // Chỉ khi Kết nối tới Database thành công thì mới Start Server Back-end lên.
// CONNECT_DB() //vì CONNECT_DB này là 1 async thì nó trả về 1 promise
//   .then(() => console.log('Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER()) //sẽ được thực thi ngay sau khi cái then trước đó hoàn tất, bất kể bạn return gì.
//   .catch(error => {
//     console.error(error)
//     process.exit(0) //sẽ tắt luôn chương trình Node.js ngay lập tức — kể cả đó là một server
//   })
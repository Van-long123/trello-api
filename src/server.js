/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from '~/routes/v1/index'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cookieParser from 'cookie-parser'
import socketIo from 'socket.io'
import http from 'http'
import { inviteUserToBoardSocket, userOfBoardSocket } from '~/sockets/inviteUserToBoardSocket'
import '~/config/passport'
// const http = require('http');
// const { Server } = require("socket.io");


const START_SERVER = () => {
  const app = express()

  // Fix cái vụ Cache from disk của ExpressJS
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(cookieParser())

  //Xử lý CORS
  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/v1', APIs_V1)

  //Middleware xử lý lỗi tập chung
  app.use(errorHandlingMiddleware)

  // Tạo một cái server mới bọc thằng app của express để làm real-time socket.io
  const server = http.createServer(app)
  // Khởi tạo biến io với server và cors
  const io = socketIo(server, { cors: corsOptions })
  // Lắng nghe connection
  io.on('connection', (socket) => {
    inviteUserToBoardSocket(socket)
    userOfBoardSocket(socket)
  })
  //Môi trường production
  if (env.BUILD_MODE === 'production') {
    // Môi trường thằng render nó tự động tạo PORT
    server.listen(process.env.PORT, () => {
      console.log(`Production: I am ${env.AUTHOR} running at PORT: ${ process.env.PORT }/`)
    })
  } else {
    //Môi trường Local Dev
    server.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_NAME, () => {
      console.log(`Local Dev: I am ${env.AUTHOR} running at ${ env.LOCAL_DEV_APP_NAME }:${ env.LOCAL_DEV_APP_PORT }/`)
    })
  }

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
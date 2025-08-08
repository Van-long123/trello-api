export const inviteUserToBoardSocket = (socket) => {
  // Lắng nghe sự kiện mà client emit lên là: FE_USER_INVITED_TO_BOARD
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    /* Emit ngược lại một sự kiện về cho mọi client khác (ngoại trừ chính cái
      * thằng gửi emit lên),rồi để phía FE check*/
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}
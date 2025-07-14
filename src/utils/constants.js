//Những domain được phép truy cập tới tài nguyên của Server
export const WHITELIST_ORIGIN = [
  // 'http://localhost:5173'//ko cần localhost nữa vì ở file config/cors đã luôn luôn cho phép môi trường dev
  'https://trello-web-three-pink.vercel.app'
]

export const BOARD_TYPES = {
  PUBLIC : 'public',
  PRIVATE: 'private'
}
import { env } from '~/config/environment'
//Những domain được phép truy cập tới tài nguyên của Server
export const WHITELIST_ORIGIN = [
  // 'http://localhost:5173'//ko cần localhost nữa vì ở file config/cors đã luôn luôn cho phép môi trường dev
  'https://trello-web-three-pink.vercel.app'
]

export const BOARD_TYPES = {
  PUBLIC : 'public',
  PRIVATE: 'private'
}
export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 12

export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PROD : env.WEBSITE_DOMAIN_DEV

// Kiểu lời mời vào board....
export const INVITATION_TYPES = {
  BOARD_INVITATION:'BOARD_INVITATION' // Kiểu lời mời vào board
}
export const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

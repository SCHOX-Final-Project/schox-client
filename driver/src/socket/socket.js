import io from 'socket.io-client'
import { baseUrl } from '../constants/baseUrl.js'
export const socketInstance = io(baseUrl) // ganti ke ip local/ link deploy
import io from 'socket.io-client'
import { baseUrl } from '../constants/baseUrl'
export const socketInstance = io('http://192.168.1.8:3000') // ganti ke ip local/ link deploy
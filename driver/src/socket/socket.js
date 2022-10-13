import io from 'socket.io-client'
<<<<<<< HEAD
import baseUrl from '../constants/baseUrl'
=======
import {baseUrl} from "../constants/baseUrl";
>>>>>>> e5e970f9e926c97a8dffd2ba166c05927e7e8a74
export const socketInstance = io(baseUrl) // ganti ke ip local/ link deploy
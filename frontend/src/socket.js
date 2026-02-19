import { io } from 'socket.io-client'

// By default connect to the same origin as the frontend dev server.
// During development, Vite proxies `/socket.io` to the backend.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin

export function createSocket() {
  return io(SOCKET_URL, {
    withCredentials: true,
  })
}
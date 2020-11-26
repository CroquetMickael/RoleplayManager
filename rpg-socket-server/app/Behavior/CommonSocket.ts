import Room from 'App/Models/Room'
import { Socket } from 'socket.io'

async function updateGameInformation (socket: Socket, roomName: string) {
  const room = await Room.query().where('name', '=', roomName).preload('players', (query) => {
    query.preload('spells')
  }).preload('monsters').first()
  socket.nsp.in(roomName).emit('updateGameInformation', room)
}

async function updateLobbyInformation (socket: Socket) {
  const rooms = await Room.query().preload('players', (query) => {
    query.where('isConnected', true)
  })
  socket.nsp.emit('updateLobbyInformation', rooms)
}

export { updateGameInformation, updateLobbyInformation }

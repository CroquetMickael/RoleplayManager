import Room from 'App/Models/Room'
import { DateTime } from 'luxon'
import { Socket } from 'socket.io'

async function updateGameInformation (socket: Socket, roomName: string) {
  const room = await Room.query().where('name', '=', roomName).preload('players', (query) => {
    query.preload('spells').pivotColumns(['isConnected', 'initiative'])
  }).preload('monsters', (query) => {
    query.preload('spells')
  }).preload('logs').first()
  socket.nsp.in(roomName).emit('updateGameInformation', room)
}

async function updateLobbyInformation (socket: Socket) {
  const rooms = await Room.query().preload('players', (query) => {
    query.where('isConnected', true)
  })
  socket.nsp.emit('updateLobbyInformation', rooms)
}

export { updateGameInformation, updateLobbyInformation }

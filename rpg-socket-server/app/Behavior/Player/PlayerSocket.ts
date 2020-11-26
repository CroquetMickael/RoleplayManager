import Player from 'App/Models/Player'
import Room from 'App/Models/Room'
import { DateTime } from 'luxon'
import { Socket } from 'socket.io'
import { updateGameInformation } from '../CommonSocket'

export class PlayerSocket {
  public modifyPlayerInititive (socket: Socket) {
    socket.on('modifyPlayerInitiative', async function (Information) {
      if (!Information) {
        return
      }
      const {
        playerName,
        roomName,
        id,
        initiative,
      } = Information
      const room = await Room.query().where('name', '=', roomName).first()
      if (room && playerName === room.owner) {
        const player = await Player.find(id)
        if (player) {
          player.initiative = Number(initiative)
          room.lastUsedDate = DateTime.utc()
          await player.save()
          await room.save()
          socket.nsp.in(roomName).emit('playerInitiativeHasBeenModified', player.name)
          updateGameInformation(socket, roomName)
        }
      }
    })
  }

  public playerCheckConnection (socket: Socket) {
    socket.on('playerCheckConnection', async function ({roomName, playerName}) {
      const room = await Room.query().where('name', '=', roomName).preload('players').first()
      if (room) {
        const player = room.players.find((player) => player.name === playerName)
        if (player || room.owner === playerName) {
          if (socket.rooms[roomName] === undefined) {
            socket.join(roomName)
            socket.emit('playerAllowedOrReconnected')
          } else {
            socket.emit('playerAllowedOrReconnected')
          }
        } else {
          socket.emit('playerNotAllowed')
        }
      } else {
        socket.emit('playerNotAllowed')
      }
    })
  }

  public checkPlayerName (socket: Socket) {
    socket.on('checkPlayerName', async function (playerName) {
      let isValid = true
      const player = await Player.query().where('name', '=', playerName).first()
      if (player) {
        isValid = false
      }
      socket.emit('checkPlayerReturn', isValid)
    })
  }
}


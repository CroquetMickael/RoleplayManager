import Player from 'App/Models/Player'
import Room from 'App/Models/Room'
import { DateTime } from 'luxon'
import { Socket } from 'socket.io'
import { updateGameInformation, updateLobbyInformation } from '../CommonSocket'
import { ExcedMaxPlayer, generateRoomPassword } from './RoomHelper'

export class RoomSocket {
  public createRoom (socket: Socket) {
    socket.on('createRoom', async function (roomInformation) {
      if (!roomInformation) {
      }
      const { playerName, roomName, maxPlayer } = roomInformation
      const room = await Room.findBy('name', roomName)
      const owner = await Player.findBy('name', playerName)
      if (isNaN(maxPlayer) || (room !== null)) {
        return
      }
      try {
        if (owner) {
          await Room.create({
            name: roomName,
            isOwnerConnected: true,
            lastUsedDate: DateTime.utc(),
            password: generateRoomPassword(),
            maxPlayer: Number(maxPlayer),
            ownerId: owner.id,
          })
          await owner.save()
          socket.join(roomName)
          socket.emit('roomCreated')
        }
      } catch (ex) {
        console.log(ex)
      }
    })
  }

  public joinRoom (socket: Socket) {
    socket.on('joinRoom', async function (roomInformation) {
      if (!roomInformation) {
      }
      const { playerName, roomName, roomPassword }: { playerName: string, roomName: string, roomPassword: string } = roomInformation
      const room = await Room.query().where('name', '=', roomName).preload('players', (query) => {
        query.pivotColumns(['isConnected'])
      }).first()
      const owner = await Player.findBy('name', playerName)
      if (owner) {
        if (room !== null && room.ownerId !== owner.id && room.password === roomPassword) {
          const player = await Player.findBy('name', playerName)
          if (player && !room.players.find((player) => player.name === playerName)) {
            await room.related('players').save(player)
          } else if (player) {
            if (ExcedMaxPlayer(room)) {
              return
            }
            await room.related('players').sync({
              [player.id]: {
                isConnected: true,
              },
            })
          }
          socket.emit('roomJoined')
          socket.join(roomName)
          room.lastUsedDate = DateTime.utc()
        }
        if (room?.ownerId === owner.id && room?.password === roomPassword) {
          socket.emit('roomJoined')
          socket.join(roomName)
          room.isOwnerConnected = true
          room.lastUsedDate = DateTime.utc()
          await room.save()
          socket.to(roomName).emit('GMJoined')
        }
      }
    })
  }

  public leaveRoom (socket: Socket) {
    socket.on('leaveRoom', async function (roomInformation) {
      if (!roomInformation) {
        return
      }
      const { playerId, roomName } = roomInformation
      const room = await Room.query().where('name', '=', roomName).preload('players').first()
      if (room) {
        if (playerId === room.ownerId) {
          room.isOwnerConnected = false
        } else {
          const player = room.players.find(player => player.id === playerId)
          if (player) {
            room.related('players').sync({
              [player.id]: {
                isConnected: false,
              },
            })
            await player.save()
          }
        }
        await room.save()
        socket.leave(roomName)
        socket.nsp.to(roomName).emit('playerLeave')
        updateGameInformation(socket, roomName)
      }
    })
  }

  public modifyRoomPassword (socket: Socket) {
    socket.on('modifyRoomPassword', async function (roomInformation) {
      if (!roomInformation) {
        return
      }
      const { playerId, roomName, password }: { playerId: number, roomName: string, password: string } = roomInformation
      const room = await Room.query().where('name', '=', roomName).first()
      if (room) {
        if (playerId === room.ownerId) {
          room.password = password
          await room.save()
          socket.nsp.in(roomName).emit('roomPasswordChanged')
          updateGameInformation(socket, roomName)
        }
      }
    })
  }

  public getRooms (socket: Socket) {
    socket.on('getRooms', function () {
      updateLobbyInformation(socket)
    })
  }

  public getRoomInformation (socket: Socket) {
    socket.on('getGameInformation', function (roomName) {
      updateGameInformation(socket, roomName)
    })
  }
}


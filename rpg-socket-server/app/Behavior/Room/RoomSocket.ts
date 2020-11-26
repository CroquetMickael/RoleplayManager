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
      if (isNaN(maxPlayer) || (room !== null)) {
        return
      }
      try {
        await Room.create({
          name: roomName,
          owner: playerName,
          isOwnerConnected: true,
          lastUsedDate: DateTime.utc(),
          password: generateRoomPassword(),
          maxPlayer: Number(maxPlayer),
        })
        socket.join(roomName)
        socket.emit('roomCreated')
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
      const room = await Room.query().where('name', '=', roomName).preload('players').first()
      if (room !== null && room.owner !== playerName && room.password === roomPassword) {
        const player = room.players.find((player) => player.name === playerName)
        if (player) {
          player.isConnected = true
          await player.save()
        } else {
          if (ExcedMaxPlayer(room)) {
            return
          }
          await Player.create({
            name: playerName,
            isConnected: true,
            roomId: room.id,
          })
        }
        socket.join(roomName)
        socket.emit('roomJoined')
        socket.to(roomName).emit('PlayerJoined', playerName)
        updateGameInformation(socket, roomName)
      }
      if (room?.owner === playerName && room?.password === roomPassword) {
        socket.emit('roomJoined')
        socket.join(roomName)
        room.isOwnerConnected = true
        room.lastUsedDate = DateTime.utc()
        await room.save()
        socket.to(roomName).emit('GMJoined')
      }
    })
  }

  public leaveRoom (socket: Socket) {
    socket.on('leaveRoom', async function (roomInformation) {
      if (!roomInformation) {
        return
      }
      const { playerName, roomName } = roomInformation
      const room = await Room.query().where('name', '=', roomName).preload('players').first()
      if (room) {
        if (playerName === room.owner) {
          room.isOwnerConnected = false
        } else {
          const player = room.players.find(player => player.name === playerName)
          if (player) {
            player.isConnected = false
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
      const { playerName, roomName, password }: { playerName: string, roomName: string, password: string } = roomInformation
      const room = await Room.query().where('name', '=', roomName).first()
      if (room) {
        if (playerName === room.owner) {
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


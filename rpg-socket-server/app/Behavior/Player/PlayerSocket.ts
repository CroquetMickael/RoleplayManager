import Log from 'App/Models/Log'
import Player from 'App/Models/Player'
import Room from 'App/Models/Room'
import { DateTime } from 'luxon'
import { Socket } from 'socket.io'
import { updateGameInformation } from '../CommonSocket'

export class PlayerSocket {
  public modifyPlayerInititive(socket: Socket) {
    socket.on('modifyPlayerInitiative', async function (Information) {
      if (!Information) {
        return
      }
      const {
        playerId,
        roomId,
        id,
        initiative,
      } = Information
      const room = await Room.query().where('id', '=', roomId).preload('players').first();
      if (room && playerId === room.ownerId) {
        const player = room.players.find((player) => player.id == id);
        if (player) {
          room.lastUsedDate = DateTime.utc()
          room.related('players').detach([player.id])
          room.related('players').attach({
            [player.id]: {
              initiative: Number(initiative),
              isConnected: player.isConnected,
            },
          })
          await room.save()
          await Log.create({
            log: `GM has changed initiative for player ${player.name}`,
            roomId: room.id,
          })
          socket.nsp.in(room.name.toString()).emit('playerInitiativeHasBeenModified', player.name)
          updateGameInformation(socket, room.name.toString())
        }
      }
    })
  }

  public playerCheckConnection(socket: Socket) {
    socket.on('playerCheckConnection', async function ({ roomName, playerName }) {
      const room = await Room.query().where('name', '=', roomName).preload('players').first()
      if (room) {
        const player = await Player.findBy('name', playerName)
        if (player) {
          const currentPlayer = room.players.find((wantedPlayer) => wantedPlayer.id == player.id);
          if (room.ownerId === player?.id) {
            if (socket.rooms[roomName] === undefined) {
              socket.join(roomName)
            }
            room.isOwnerConnected = true;
            await room.save();
            socket.emit('playerAllowedOrReconnected')
          } else if (room.players.some(player => player.id === currentPlayer?.id)) {
            if (socket.rooms[roomName] === undefined) {
              socket.join(roomName)
            }
            if (!currentPlayer?.isConnected && currentPlayer) {
              await room.related('players').detach([currentPlayer.id])
              await room.related('players').attach({
                [currentPlayer.id]: {
                  initiative: currentPlayer.initiative,
                  isConnected: true
                }
              })
            }
            socket.emit('playerAllowedOrReconnected')
          }
        }
      }
    })
  }

  public checkPlayerName(socket: Socket) {
    socket.on('checkPlayerName', async function (playerName) {
      let isValid = true
      const player = await Player.query().where('name', '=', playerName).first()
      if (player) {
        isValid = false
      }
      socket.emit('checkPlayerReturn', isValid)
    })
  }

  public createPlayer(socket: Socket) {
    socket.on('createPlayer', async function (playerName) {
      await Player.create({
        name: playerName,
      })
    })
  }

  public getPlayerid(socket: Socket) {
    socket.on('getPlayerId', async function (playerName: string) {
      const player = await Player.findBy('name', playerName)
      if (player) {
        socket.emit('playerIdReturn', player.id)
      }
    })
  }
}


import Player from 'App/Models/Player'
import Room from 'App/Models/Room'
import { DateTime } from 'luxon'
import { Socket } from 'socket.io'

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
          socket.emit('playerInitiativeHasBeenModified', player.name)
        }
      }
    })
  }
}


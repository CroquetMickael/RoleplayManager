import Log from 'App/Models/Log'
import Monster from 'App/Models/Monster'
import Room from 'App/Models/Room'
import { DateTime } from 'luxon'
import { Socket } from 'socket.io'
import { updateGameInformation } from '../CommonSocket'

export class MonsterSocket {
  public addMonster (socket: Socket) {
    socket.on('addMonster', async function (Information) {
      if (!Information) {
        return
      }
      const {
        playerId,
        roomId,
        monsterName,
        monsterInitiative,
      } = Information
      const room = await Room.find(roomId)
      if (room && playerId === room.ownerId) {
        await Monster.create({
          name: monsterName,
          initiative: Number(monsterInitiative),
          roomId: room.id,
        })
        room.lastUsedDate = DateTime.utc()
        await room.save()
        await Log.create({
          log: `A new monster appear named: ${monsterName}`,
          roomId: room.id,
        })
        socket.nsp.in(room.name.toString()).emit('monsterHasBeenAdded', monsterName)
        updateGameInformation(socket, room.name.toString())
      }
    })
  }

  public modifyMonsterInititive (socket: Socket) {
    socket.on('modifyMonsterInitiative', async function (Information) {
      if (!Information) {
        return
      }
      const {
        playerId,
        roomId,
        id,
        initiative,
      } = Information
      const room = await Room.find(roomId)
      if (room && playerId === room.ownerId) {
        const monster = await Monster.find(id)
        if (monster) {
          monster.initiative = Number(initiative)
          room.lastUsedDate = DateTime.utc()
          await monster.save()
          await room.save()
          socket.nsp.in(room.name.toString()).emit('monsterInitiativeHasBeenModified', monster.name)
          updateGameInformation(socket, room.name.toString())
        }
      }
    })
  }

  public deleteMonster (socket: Socket) {
    socket.on('deleteMonster', async function (Information) {
      if (!Information) {
        return
      }
      const {
        playerId,
        roomId,
        id,
      } = Information
      const room = await Room.find(roomId)
      if (room && playerId === room.ownerId) {
        const monster = await Monster.find(id)
        if (monster) {
          await monster.delete()
          room.lastUsedDate = DateTime.utc()
          await room.save()
          socket.nsp.in(room.name.toString()).emit('monsterHasBeenDeleted')
          updateGameInformation(socket, room.name.toString())
        }
      }
    })
  }
}


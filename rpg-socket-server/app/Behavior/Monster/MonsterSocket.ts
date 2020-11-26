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
        playerName,
        roomName,
        monsterName,
        monsterInitiative,
      } = Information
      const room = await Room.query().where('name', '=', roomName).first()
      if (room && playerName === room.owner) {
        await Monster.create({
          name: monsterName,
          initiative: Number(monsterInitiative),
          roomId: room.id,
        })
        room.lastUsedDate = DateTime.utc()
        await room.save()
        socket.nsp.in(roomName).emit('monsterHasBeenAdded', monsterName)
        updateGameInformation(socket, roomName)
      }
    })
  }

  public modifyMonsterInititive (socket: Socket) {
    socket.on('modifyMonsterInitiative', async function (Information) {
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
        const monster = await Monster.find(id)
        if (monster) {
          monster.initiative = Number(initiative)
          room.lastUsedDate = DateTime.utc()
          await monster.save()
          await room.save()
          socket.nsp.in(roomName).emit('monsterInitiativeHasBeenModified', monster.name)
          updateGameInformation(socket, roomName)
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
        playerName,
        roomName,
        id,
      } = Information
      const room = await Room.query().where('name', '=', roomName).first()
      if (room && playerName === room.owner) {
        const monster = await Monster.find(id)
        if (monster) {
          await monster.delete()
          room.lastUsedDate = DateTime.utc()
          await room.save()
          socket.nsp.in(roomName).emit('monsterHasBeenDeleted')
          updateGameInformation(socket, roomName)
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
        playerName,
        roomName,
        id,
      } = Information
      const room = await Room.query().where('name', '=', roomName).first()
      if (room && playerName === room.owner) {
        const monster = await Monster.find(id)
        if (monster) {
          await monster.delete()
          room.lastUsedDate = DateTime.utc()
          await room.save()
          socket.emit('monsterHasBeenDeleted', monster.name)
        }
      }
    })
  }
}


import { MonsterSocket } from 'App/Behavior/Monster/MonsterSocket'
import { PlayerSocket } from 'App/Behavior/Player/PlayerSocket'
import { RoomSocket } from 'App/Behavior/Room/RoomSocket'
import { SpellSocket } from 'App/Behavior/Spell/SpellSocket'
import { applyMixins } from 'App/Helper/helper'
import Room from 'App/Models/Room'
import { SocketIO } from 'App/Services/Socket'
import { DateTime } from 'luxon'
import { Socket } from 'socket.io'

/**
 * Standard business from here
 */
applyMixins(SocketIO, [RoomSocket, SpellSocket, MonsterSocket, PlayerSocket])
const socketBehavior = new SocketIO()

const thirtyMinute = 1800000

setInterval(async () => {
  const rooms = await Room.all()
  rooms.forEach(async room => {
    if (DateTime.utc().month - room.lastUsedDate.month === 1) {
      await room.delete()
    }
  })
}, thirtyMinute)

socketBehavior.start((socket: Socket) => {
  // Room Informations
  socketBehavior.getRooms(socket)
  socketBehavior.getRoomInformation(socket)

  // Room CRUD
  socketBehavior.createRoom(socket)
  socketBehavior.joinRoom(socket)
  socketBehavior.leaveRoom(socket)
  socketBehavior.modifyRoomPassword(socket)

  //Spell CRUD
  socketBehavior.addSpell(socket)
  socketBehavior.useSpell(socket)
  socketBehavior.modifySpell(socket)
  socketBehavior.deleteSpell(socket)
  //socketBehavior.importSpells(socket)
  socketBehavior.decrementSpellsCooldownFromEndOfRound(socket)

  //Monster CRUD
  socketBehavior.addMonster(socket)
  socketBehavior.modifyMonsterInititive(socket)

  //Player CRUD
  socketBehavior.modifyPlayerInititive(socket)
})

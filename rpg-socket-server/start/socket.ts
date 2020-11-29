import { MonsterSocket } from 'App/Behavior/Monster/MonsterSocket'
import { PlayerSocket } from 'App/Behavior/Player/PlayerSocket'
import { RoomSocket } from 'App/Behavior/Room/RoomSocket'
import { SpellSocket } from 'App/Behavior/Spell/SpellSocket'
import Room from 'App/Models/Room'
import { SocketIO } from 'App/Services/Socket'
import { DateTime } from 'luxon'
import { Socket } from 'socket.io'

function applyMixins (derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        /*@ts-ignore*/
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      )
    })
  })
}

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
  console.log('Socket.io started')

  // Room CRUD
  socketBehavior.createRoom(socket)
  socketBehavior.joinRoom(socket)
  socketBehavior.leaveRoom(socket)
  socketBehavior.modifyRoomPassword(socket)
  socketBehavior.getRoomInformation(socket)
  socketBehavior.getRooms(socket)

  //Spell CRUD
  socketBehavior.addSpellToPlayer(socket)
  socketBehavior.useSpell(socket)
  socketBehavior.modifySpell(socket)
  socketBehavior.deleteSpell(socket)
  //socketBehavior.importSpells(socket)
  socketBehavior.decrementSpellsCooldownFromEndOfRound(socket)

  //Monster CRUD
  socketBehavior.addMonster(socket)
  socketBehavior.addSpellToMonster(socket)
  socketBehavior.modifyMonsterInititive(socket)
  socketBehavior.deleteMonster(socket)

  //Player CRUD
  socketBehavior.modifyPlayerInititive(socket)
  socketBehavior.checkPlayerName(socket)
  socketBehavior.playerCheckConnection(socket)
  socketBehavior.createPlayer(socket)
  socketBehavior.getPlayerid(socket)
})

import Log from 'App/Models/Log'
import Room from 'App/Models/Room'
import Spell from 'App/Models/Spell'
import { DateTime } from 'luxon'
import { Socket } from 'socket.io'
import { updateGameInformation } from '../CommonSocket'
import { checkSpellInputs } from './SpellHelper'

const Validator = require('jsonschema').Validator
const validator = new Validator()
const arraySpellSchema = {
  type: 'array',
  items: {
    properties: {
      id: { type: 'number' },
      name: { type: 'string' },
      description: { type: 'string' },
      defaultCooldown: { type: 'number' },
      currentCooldown: { type: 'number' },
      playerId: { type: 'number' },
    },
    required: ['id', 'name', 'defaultCooldown', 'currentCooldown', 'description', 'playerId'],
  },
}

export class SpellSocket {
  public addSpellToPlayer (socket: Socket) {
    socket.on('addSpellToPlayer', async function (Information) {
      if (!Information) {
        return
      }
      const {
        entityId,
        roomId,
        spellName,
        spellCooldown,
        spellDescription,
      } = Information
      const room = await Room.query().where('id', '=', roomId).preload('players', (query) => {
        query.preload('spells')
      }).first()
      const validate = checkSpellInputs(spellName, spellDescription, spellCooldown)
      if (validate === true && room !== null) {
        const player = room.players.find((player) => player.id === entityId)
        if (player && !player?.spells.some((spell: Spell) => spell.name === spellName)) {
          await Spell.create({
            name: spellName,
            currentCooldown: 0,
            defaultCooldown: Number(spellCooldown),
            description: spellDescription,
            roomId: room.id,
            playerId: player.id,
          })
          room.lastUsedDate = DateTime.utc()
          await room.save()
          await Log.create({
            log: `A new spell has been added for ${player.name}`,
            roomId: room.id,
          })
          socket.nsp.in(room.name.toString()).emit('spellHasBeenAdded')
          updateGameInformation(socket, room.name.toString())
        }
      }
    })
  }

  public addSpellToMonster (socket: Socket) {
    socket.on('addSpellToMonster', async function (Information) {
      if (!Information) {
        return
      }
      const {
        entityId,
        roomId,
        spellName,
        spellCooldown,
        spellDescription,
      } = Information
      const room = await Room.query().where('id', '=', roomId).preload('monsters', (query) => {
        query.preload('spells')
      }).first()
      const validate = checkSpellInputs(spellName, spellDescription, spellCooldown)
      if (validate === true && room !== null) {
        const monster = room.monsters.find((monster) => monster.id === entityId)
        if (monster && !monster?.spells.some((spell: Spell) => spell.name === spellName)) {
          await Spell.create({
            name: spellName,
            currentCooldown: 0,
            defaultCooldown: Number(spellCooldown),
            description: spellDescription,
            roomId: room.id,
            monsterId: monster.id,
          })
          room.lastUsedDate = DateTime.utc()
          await room.save()
          socket.nsp.in(room.name.toString()).emit('spellHasBeenAdded')
          updateGameInformation(socket, room.name.toString())
        }
      }
    })
  }

  public importSpells (socket: Socket) {
    socket.on('importSpells', async function (Information) {
      const { spells }: { playerName: string, spells: string } = Information
      try {
        const spellsFormated: Array<Spell> = JSON.parse(spells)
        const validatorResult = validator.validate(
          spellsFormated,
          arraySpellSchema
        )
        if (validatorResult.valid) {
          await Spell.updateOrCreateMany('id', spellsFormated)
          socket.emit('spellsImported')
        }
      } catch (error) {
        console.log(error)
        socket.emit('spellBadFormat')
        return
      }
    })
  }

  public useSpell (socket: Socket) {
    socket.on('useSpell', async function (Information) {
      if (!Information) {
        return
      }
      const { roomId, spellId, entityName } = Information
      const room = await Room.find(roomId)
      if (room !== null) {
        const spell = await Spell.findBy('id', spellId)
        if (spell) {
          spell.currentCooldown = spell.defaultCooldown
          room.lastUsedDate = DateTime.utc()
          await spell.save()
          await room.save()
        }
        await Log.create({
          log: `${spell?.name} has been used by ${entityName}`,
          roomId: room.id,
        })
        socket.nsp.in(room.name.toString()).emit('spellHasBeenUsed')
        updateGameInformation(socket, room.name.toString())
      }
    })
  }

  public modifySpell (socket: Socket) {
    socket.on('modifySpell', async function (Information) {
      if (!Information) {
      }
      const {
        spellId,
        roomId,
        spellName,
        spellCooldown,
        spellDescription,
        spellCurrentCooldown,
        isOwner,
      } = Information
      const room = await Room.find(roomId)
      if (room) {
        const spell = await Spell.find(spellId)
        if (spell?.currentCooldown === 0 || isOwner) {
          spell?.merge({
            currentCooldown: Number(spellCurrentCooldown),
            defaultCooldown: Number(spellCooldown),
            description: spellDescription,
            name: spellName,
          })
          room.lastUsedDate = DateTime.utc()
          await spell?.save()
          await room.save()
        }
        socket.nsp.in(room?.name.toString()).emit('spellHasBeenModified', spellName)
        updateGameInformation(socket, room?.name.toString())
      }
    })
  }

  public deleteSpell (socket: Socket) {
    socket.on('deleteSpell', async function (Information) {
      if (!Information) {
      }
      const { roomId, spellId } = Information
      try {
        const room = await Room.find(roomId)
        const spell = await Spell.find(spellId)
        if (spell && room) {
          room.lastUsedDate = DateTime.utc()
          await spell.delete()
          await room?.save()
          socket.nsp.in(room.name.toString()).emit('spellHasBeenDeleted', spell.name)
          updateGameInformation(socket, room.name.toString())
        }
      } catch (e) {
        console.log(e)
      }
    })
  }
  public decrementSpellsCooldownFromEndOfRound (socket: Socket) {
    socket.on('endOfRound', async function (roomInformation) {
      if (!roomInformation) {
      }
      const { playerId, roomId }: { playerId: number, roomId: number } = roomInformation
      const room = await Room.query().where('id', '=', roomId).preload('players', (query) => {
        query.preload('spells', subQuery => {
          subQuery.where('room_id', roomId)
        })
      }).preload('monsters', (query) =>
        query.preload('spells', subquery => {
          subquery.where('room_id', roomId)
        })).first()
      if (room?.ownerId === playerId && room) {
        room?.players.forEach((player) => {
          player.spells.forEach(async (spell: Spell) => {
            if (spell.currentCooldown !== 0) {
              spell.currentCooldown--
              await spell.save()
            }
          })
        })
        room?.monsters.forEach((monster) => {
          monster.spells.forEach(async (spell: Spell) => {
            if (spell.currentCooldown !== 0) {
              spell.currentCooldown--
              await spell.save()
            }
          })
        })
        room.lastUsedDate = DateTime.utc()
        await room.save()
        await Log.create({
          log: 'GM has ended the round',
          roomId: room.id,
        })
        socket.nsp.in(room.name.toString()).emit('RoundEnded')
        updateGameInformation(socket, room.name.toString())
      }
    })
  }
}


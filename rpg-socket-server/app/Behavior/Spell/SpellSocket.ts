import Room from 'App/Models/Room'
import Spell from 'App/Models/Spell'
import { DateTime } from 'luxon'
import { Socket } from 'socket.io'
import { CommonSocket, updateGameInformation } from '../CommonSocket'
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
  public addSpell (socket: Socket) {
    socket.on('addSpell', async function (Information) {
      if (!Information) {
        return
      }
      const {
        playerName,
        roomName,
        spellName,
        spellCooldown,
        spellDescription,
      } = Information
      const room = await Room.query().where('name', '=', roomName).preload('players', (query) => {
        query.preload('spells')
      }).first()
      const validate = checkSpellInputs(spellName, spellDescription, spellCooldown)
      if (validate === true && room !== null) {
        const player = room.players.find((player) => player.name === playerName)
        if (player && !player?.spells.some((spell: Spell) => spell.name === spellName)) {
          await Spell.create({
            playerId: player.id,
            name: spellName,
            currentCooldown: 0,
            defaultCooldown: Number(spellCooldown),
            description: spellDescription,
          })
          room.lastUsedDate = DateTime.utc()
          await room.save()
          socket.nsp.in(roomName).emit('spellHasBeenAdded')
          updateGameInformation(socket, roomName)
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
      const { roomName, spellId } = Information
      const room = await Room.query().where('name', '=', roomName).first()
      if (room !== null) {
        const spell = await Spell.findBy('id', spellId)
        if (spell) {
          spell.currentCooldown = spell.defaultCooldown
          room.lastUsedDate = DateTime.utc()
          await spell.save()
          await room.save()
        }
      }
      socket.nsp.in(roomName).emit('spellHasBeenUsed')
      updateGameInformation(socket, roomName)
    })
  }

  public modifySpell (socket: Socket) {
    socket.on('modifySpell', async function (Information) {
      if (!Information) {
      }
      const {
        spellId,
        roomName,
        spellName,
        spellCooldown,
        spellDescription,
        spellCurrentCooldown,
        isOwner,
      } = Information
      const room = await Room.query().where('name', '=', roomName).first()
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
      }
      socket.nsp.in(roomName).emit('spellHasBeenModified', spellName)
      updateGameInformation(socket, roomName)
    })
  }

  public deleteSpell (socket: Socket) {
    socket.on('deleteSpell', async function (Information) {
      if (!Information) {
      }
      const { roomName, spellId } = Information
      const room = await Room.query().where('name', '=', roomName).first()
      const spell = await Spell.find(spellId)
      if (spell && room) {
        room.lastUsedDate = DateTime.utc()
        await spell.delete()
        await room?.save()
        socket.nsp.in(roomName).emit('spellHasBeenDeleted', spell.name)
        updateGameInformation(socket, roomName)
      }
    })
  }
  public decrementSpellsCooldownFromEndOfRound (socket: Socket) {
    socket.on('endOfRound', async function (roomInformation) {
      if (!roomInformation) {
      }
      const { playerName, roomName }: { playerName: string, roomName: string } = roomInformation
      const room = await Room.query().where('name', '=', roomName).preload('players', (query) => {
        query.preload('spells')
      }).first()
      if (room?.owner === playerName) {
        room?.players.forEach((player) => {
          player.spells.forEach(async (spell: Spell) => {
            if (spell.currentCooldown !== 0) {
              spell.currentCooldown--
              await spell.save()
            }
          })
        })
        room.lastUsedDate = DateTime.utc()
        await room.save()
        socket.nsp.in(roomName).emit('RoundEnded')
        updateGameInformation(socket, roomName)
      }
    })
  }
}


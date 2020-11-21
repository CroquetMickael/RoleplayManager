import socketIo, { Socket } from 'socket.io'
import Server from '@ioc:Adonis/Core/Server'
import { RoomSocket } from 'App/Behavior/Room/RoomSocket'
import { SpellSocket } from 'App/Behavior/Spell/SpellSocket'
import { MonsterSocket } from 'App/Behavior/Monster/MonsterSocket'
import { PlayerSocket } from 'App/Behavior/Player/PlayerSocket'

export interface SocketIO extends RoomSocket, SpellSocket, MonsterSocket, PlayerSocket {}

export class SocketIO {
  public isReady = false
  public io: socketIo.Server

  public start (callback: (socket: socketIo.Socket) => void) {
    /*@ts-ignore*/
    this.io = socketIo(Server.instance!, {
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'HEAD', 'OPTION', 'PUT','PATCH'],
        credentials: true,
      },
    })
    this.io.on('connection', callback)
    this.isReady = true
  }
}

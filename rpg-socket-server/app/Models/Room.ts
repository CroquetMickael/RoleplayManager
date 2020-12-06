import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Player from './Player'
import Database from '@ioc:Adonis/Lucid/Database'
import Monster from './Monster'
import Spell from './Spell'
import Log from './Log'
import Env from '@ioc:Adonis/Core/Env'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: String

  @column({ columnName: 'maxPlayer', serializeAs: 'maxPlayer' })
  public maxPlayer: number

  @column()
  public ownerId: number

  @column()
  public password: string

  @column.date({ columnName: 'lastUsedDate', serializeAs: 'lastUsedDate' })
  public lastUsedDate: DateTime

  @column({ columnName: 'isOwnerConnected', serializeAs: 'isOwnerConnected' })
  public isOwnerConnected: Boolean

  @manyToMany(() => Player, {
    localKey: 'id',
    pivotForeignKey: 'room_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'player_id',
    pivotColumns: ['isConnected', 'initiative'],
    pivotTable: 'players_room',
  })
  public players: ManyToMany<typeof Player>

  @hasMany(() => Monster)
  public monsters: HasMany<typeof Monster>

  @hasMany(() => Spell)
  public spells: HasMany<typeof Spell>

  @hasMany(() => Log)
  public logs: HasMany<typeof Log>
}

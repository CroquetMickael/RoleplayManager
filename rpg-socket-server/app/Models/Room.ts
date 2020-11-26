import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Player from './Player'
import Database from '@ioc:Adonis/Lucid/Database'
import Monster from './Monster'

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
  public owner: String

  @column()
  public password: string

  @column.date({ columnName: 'lastUsedDate', serializeAs: 'lastUsedDate' })
  public lastUsedDate: DateTime

  @column({ columnName: 'isOwnerConnected', serializeAs: 'isOwnerConnected' })
  public isOwnerConnected: Boolean

  @hasMany(() => Player)
  public players: HasMany<typeof Player>

  @hasMany(() => Monster)
  public monsters: HasMany<typeof Monster>

  @beforeDelete()
  public static async activateForeignKeysForSqlite () {
    await Database.rawQuery('PRAGMA foreign_keys = ON')
  }
}

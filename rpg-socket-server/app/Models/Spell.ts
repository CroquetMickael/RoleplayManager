import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, column } from '@ioc:Adonis/Lucid/Orm'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'

export default class Spell extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: String

  @column({ columnName: 'defaultCooldown', serializeAs: 'defaultCooldown' })
  public defaultCooldown: number

  @column({ columnName: 'currentCooldown', serializeAs: 'currentCooldown' })
  public currentCooldown: number

  @column()
  public description: String

  @column()
  public roomId: number

  @column({ columnName: 'player_id' })
  public playerId: number

  @column({ columnName: 'monster_id' })
  public monsterId: number

  @beforeDelete()
  public static async activateForeignKeysForSqlite () {
    if (Env.get('NODE_ENV') === 'development') {
      await Database.rawQuery('PRAGMA foreign_keys = ON')
    }
  }
}

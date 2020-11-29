import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Spell from './Spell'
import Room from './Room'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'

export default class Player extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get initiative () {
    return this.$extras.pivot_initiative
  }

  @computed()
  public get isConnected () {
    return this.$extras.pivot_isConnected
  }

  @column()
  public name: String

  @hasMany(() => Room)
  public rooms: HasMany<typeof Room>

  @hasMany(() => Spell)
  public spells: HasMany<typeof Spell>

  @beforeDelete()
  public static async activateForeignKeysForSqlite () {
    if (Env.get('NODE_ENV') === 'development') {
      await Database.rawQuery('PRAGMA foreign_keys = ON')
    }
  }
}

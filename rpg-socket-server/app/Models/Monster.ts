import { DateTime } from 'luxon'
import { BaseModel, beforeDelete, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Spell from './Spell'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'

export default class Monster extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: String

  @column()
  public initiative: number

  @column({ columnName: 'room_id', serializeAs: 'roomId' })
  public roomId: number

  @hasMany(() => Spell)
  public spells: HasMany<typeof Spell>
}

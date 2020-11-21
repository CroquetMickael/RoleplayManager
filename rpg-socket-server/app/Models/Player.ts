import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Spell from './Spell'

export default class Player extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: String

  @column({columnName:'isConnected', serializeAs:'isConnected'})
  public isConnected: Boolean

  @column()
  public initiative: number

  @column({ columnName: 'room_id', serializeAs:'roomId' })
  public roomId: number

  @hasMany(() => Spell)
  public spells: HasMany<typeof Spell>
}

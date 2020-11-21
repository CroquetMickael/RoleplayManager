import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Spell extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public name: String

  @column({columnName:'defaultCooldown', serializeAs:'defaultCooldown'})
  public defaultCooldown: number

  @column({columnName:'currentCooldown', serializeAs:'currentCooldown'})
  public currentCooldown: number

  @column()
  public description: String

  @column({ columnName: 'player_id', serializeAs:'playerId' })
  public playerId: number
}

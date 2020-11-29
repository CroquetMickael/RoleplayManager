import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PlayersRoom extends BaseSchema {
  protected tableName = 'players_room'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.integer('player_id').notNullable()
      table.integer('room_id').notNullable()
      table.boolean('isConnected').notNullable().defaultTo(false)
      table.integer('initiative').notNullable().defaultTo(0)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

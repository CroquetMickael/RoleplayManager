import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Players extends BaseSchema {
  protected tableName = 'players'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.string('name').unique().notNullable()
      table.boolean('isConnected').notNullable()
      table.integer('initiative').defaultTo(0).notNullable()
      table.integer('room_id').unsigned()
      table.foreign('room_id','FK_PlayerRoom').references('id').inTable('rooms').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

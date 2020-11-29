import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Monsters extends BaseSchema {
  protected tableName = 'monsters'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.integer('name').notNullable()
      table.integer('initiative').notNullable()
      table.integer('room_id').notNullable()
      table.foreign('room_id').references('id').inTable('rooms').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

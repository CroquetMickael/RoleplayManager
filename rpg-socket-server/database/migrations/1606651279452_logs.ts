import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Logs extends BaseSchema {
  protected tableName = 'logs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.string('log')
      table.integer('room_id').notNullable()
      table.foreign('room_id').references('id').inTable('rooms').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

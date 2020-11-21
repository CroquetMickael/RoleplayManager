import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Rooms extends BaseSchema {
  protected tableName = 'rooms'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.string('name').unique().notNullable()
      table.integer('maxPlayer').notNullable()
      table.string('owner').unique().notNullable()
      table.string('password').notNullable()
      table.date('lastUsedDate').notNullable()
      table.boolean('isOwnerConnected').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

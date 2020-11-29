import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Rooms extends BaseSchema {
  protected tableName = 'rooms'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.text('name').notNullable()
      table.integer('maxPlayer').notNullable()
      table.integer('owner_id').notNullable()
      table.foreign('owner_id','FK_PlayerOwnerRoom').references('id').inTable('players')
      table.boolean('isOwnerConnected')
      table.text('password').notNullable()
      table.date('lastUsedDate').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

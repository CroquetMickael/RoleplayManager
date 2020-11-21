import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Spells extends BaseSchema {
  protected tableName = 'spells'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.string('name').notNullable()
      table.integer('defaultCooldown').notNullable()
      table.integer('currentCooldown').notNullable()
      table.string('description').notNullable()
      table.integer('player_id').unsigned()
      table.foreign('player_id','PlayerRoomKey').references('id').inTable('players').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

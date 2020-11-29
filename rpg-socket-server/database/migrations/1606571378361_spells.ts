import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Spells extends BaseSchema {
  protected tableName = 'spells'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.text('name').notNullable()
      table.integer('defaultCooldown').notNullable()
      table.integer('currentCooldown').notNullable()
      table.text('description').notNullable()
      table.integer('player_id')
      table.foreign('player_id').references('id').inTable('players')
      table.integer('monster_id')
      table.foreign('monster_id').references('id').inTable('monsters').onDelete('CASCADE')
      table.integer('room_id').notNullable()
      table.foreign('room_id').references('id').inTable('rooms').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Monsters extends BaseSchema {
  protected tableName = 'monsters'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)
      table.string('name').notNullable()
      table.integer('initiative').notNullable().defaultTo(0)
      table.integer('room_id').unsigned()
      table.foreign('room_id','FK_MonsterRoom').references('id').inTable('rooms').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}

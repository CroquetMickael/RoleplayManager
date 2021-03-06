import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Monsters extends BaseSchema {
  protected tableName = 'monsters'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.boolean('isNPC').defaultTo(false).notNullable()
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
    })
  }
}

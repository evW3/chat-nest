import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class Messages1625602537201 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'messages',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          generationStrategy: 'increment',
          isGenerated: true
        },
        {
          name: 'message',
          type: 'text'
        },
        {
          name: 'date',
          type: 'date'
        }
      ]
    }));
    await queryRunner.addColumn('messages', new TableColumn({
      name: 'user_id',
      type: 'int'
    }));
    await queryRunner.createForeignKey('messages', new TableForeignKey({
      columnNames: ['user_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'CASCADE'
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('messages');
    const foreignKeyUser = table.foreignKeys.find(fk => fk.columnNames.indexOf('user_id') !== -1);
    await queryRunner.dropForeignKey('messages', foreignKeyUser);
    await queryRunner.dropColumn('messages', 'user_id');
    await queryRunner.dropTable('messages');
  }
}
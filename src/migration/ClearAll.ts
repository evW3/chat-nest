import { MigrationInterface, QueryRunner} from 'typeorm';
import { Users1625602537200 } from './1625602537200-Users';
import { Messages1625602537201 } from './1625602537201-Messages';

export class ClearAll1625602537300 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {}

  public async down(queryRunner: QueryRunner): Promise<void> {
    const usersEntity = new Users1625602537200();
    const messagesEntity = new Messages1625602537201();

    await messagesEntity.down(queryRunner);
    await usersEntity.down(queryRunner);

    await queryRunner.clearTable('migrations');
  }
}
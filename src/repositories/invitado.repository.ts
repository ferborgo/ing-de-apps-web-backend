import {DefaultCrudRepository} from '@loopback/repository';
import {Invitado, InvitadoRelations} from '../models';
import {MongoCloudDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class InvitadoRepository extends DefaultCrudRepository<
  Invitado,
  typeof Invitado.prototype.id,
  InvitadoRelations
> {
  constructor(
    @inject('datasources.mongoCloud') dataSource: MongoCloudDataSource,
  ) {
    super(Invitado, dataSource);
  }
}

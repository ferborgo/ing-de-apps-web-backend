import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoCloudDataSource} from '../datasources';
import {Suscripcion, SuscripcionRelations} from '../models';

export class SuscripcionRepository extends DefaultCrudRepository<
  Suscripcion,
  typeof Suscripcion.prototype.id,
  SuscripcionRelations
> {
  constructor(
    @inject('datasources.mongoCloud') dataSource: MongoCloudDataSource
  ) {
    super(Suscripcion, dataSource);
  }
}

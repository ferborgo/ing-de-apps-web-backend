import {DefaultCrudRepository} from '@loopback/repository';
import {Opcion, OpcionRelations} from '../models';
import {MongoCloudDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OpcionRepository extends DefaultCrudRepository<
  Opcion,
  typeof Opcion.prototype.id,
  OpcionRelations
> {
  constructor(
    @inject('datasources.mongoCloud') dataSource: MongoCloudDataSource,
  ) {
    super(Opcion, dataSource);
  }
}

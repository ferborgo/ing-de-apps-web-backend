import {DefaultCrudRepository} from '@loopback/repository';
import {OpcionElegida, OpcionElegidaRelations} from '../models';
import {MongoCloudDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class OpcionElegidaRepository extends DefaultCrudRepository<
  OpcionElegida,
  typeof OpcionElegida.prototype.id,
  OpcionElegidaRelations
> {
  constructor(
    @inject('datasources.mongoCloud') dataSource: MongoCloudDataSource,
  ) {
    super(OpcionElegida, dataSource);
  }
}

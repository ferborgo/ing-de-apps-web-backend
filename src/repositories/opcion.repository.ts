import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Opcion, OpcionRelations, OpcionElegida} from '../models';
import {MongoCloudDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {OpcionElegidaRepository} from './opcion-elegida.repository';

export class OpcionRepository extends DefaultCrudRepository<
  Opcion,
  typeof Opcion.prototype.id,
  OpcionRelations
> {

  public readonly opcionElegidas: HasManyRepositoryFactory<OpcionElegida, typeof Opcion.prototype.id>;

  constructor(
    @inject('datasources.mongoCloud') dataSource: MongoCloudDataSource, @repository.getter('OpcionElegidaRepository') protected opcionElegidaRepositoryGetter: Getter<OpcionElegidaRepository>,
  ) {
    super(Opcion, dataSource);
    this.opcionElegidas = this.createHasManyRepositoryFactoryFor('opcionElegidas', opcionElegidaRepositoryGetter,);
  }
}

import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Invitado, InvitadoRelations, OpcionElegida} from '../models';
import {MongoCloudDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {OpcionElegidaRepository} from './opcion-elegida.repository';

export class InvitadoRepository extends DefaultCrudRepository<
  Invitado,
  typeof Invitado.prototype.id,
  InvitadoRelations
> {

  public readonly opcionElegidas: HasManyRepositoryFactory<OpcionElegida, typeof Invitado.prototype.id>;

  constructor(
    @inject('datasources.mongoCloud') dataSource: MongoCloudDataSource, @repository.getter('OpcionElegidaRepository') protected opcionElegidaRepositoryGetter: Getter<OpcionElegidaRepository>,
  ) {
    super(Invitado, dataSource);
    this.opcionElegidas = this.createHasManyRepositoryFactoryFor('opcionElegidas', opcionElegidaRepositoryGetter,);
    this.registerInclusionResolver('opcionElegidas', this.opcionElegidas.inclusionResolver);
  }
}

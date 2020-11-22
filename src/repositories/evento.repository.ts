import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Evento, EventoRelations, Opcion, Invitado} from '../models';
import {MongoCloudDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {OpcionRepository} from './opcion.repository';
import {InvitadoRepository} from './invitado.repository';

export class EventoRepository extends DefaultCrudRepository<
  Evento,
  typeof Evento.prototype.id,
  EventoRelations
> {

  public readonly opciones: HasManyRepositoryFactory<Opcion, typeof Evento.prototype.id>;

  public readonly invitados: HasManyRepositoryFactory<Invitado, typeof Evento.prototype.id>;

  constructor(
    @inject('datasources.mongoCloud') dataSource: MongoCloudDataSource, @repository.getter('OpcionRepository') protected opcionRepositoryGetter: Getter<OpcionRepository>, @repository.getter('InvitadoRepository') protected invitadoRepositoryGetter: Getter<InvitadoRepository>,
  ) {
    super(Evento, dataSource);
    this.invitados = this.createHasManyRepositoryFactoryFor('invitados', invitadoRepositoryGetter,);
    this.registerInclusionResolver('invitados', this.invitados.inclusionResolver);
    this.opciones = this.createHasManyRepositoryFactoryFor('opciones', opcionRepositoryGetter,);
    this.registerInclusionResolver('opciones', this.opciones.inclusionResolver);
  }
}

import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Evento,
  Invitado
} from '../models';
import {EventoRepository} from '../repositories';

export class EventoInvitadoController {
  constructor(
    @repository(EventoRepository) protected eventoRepository: EventoRepository,
  ) {}

  @get('/eventos/{id}/invitados', {
    responses: {
      '200': {
        description: 'Array of Evento has many Invitado',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Invitado)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Invitado>,
  ): Promise<Invitado[]> {
    return this.eventoRepository.invitados(id).find(filter);
  }

  @post('/eventos/{id}/invitados', {
    responses: {
      '200': {
        description: 'Evento model instance',
        content: {'application/json': {schema: getModelSchemaRef(Invitado)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Evento.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Invitado, {
            title: 'NewInvitadoInEvento',
            exclude: ['id'],
            optional: ['eventoId']
          }),
        },
      },
    }) invitado: Omit<Invitado, 'id'>,
  ): Promise<Invitado> {
    return this.eventoRepository.invitados(id).create(invitado);
  }

  @patch('/eventos/{id}/invitados', {
    responses: {
      '200': {
        description: 'Evento.Invitado PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Invitado, {partial: true}),
        },
      },
    })
    invitado: Partial<Invitado>,
    @param.query.object('where', getWhereSchemaFor(Invitado)) where?: Where<Invitado>,
  ): Promise<Count> {
    return this.eventoRepository.invitados(id).patch(invitado, where);
  }

  @del('/eventos/{id}/invitados', {
    responses: {
      '200': {
        description: 'Evento.Invitado DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Invitado)) where?: Where<Invitado>,
  ): Promise<Count> {
    return this.eventoRepository.invitados(id).delete(where);
  }
}

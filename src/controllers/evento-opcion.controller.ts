import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Evento,
  Opcion,
} from '../models';
import {EventoRepository} from '../repositories';

export class EventoOpcionController {
  constructor(
    @repository(EventoRepository) protected eventoRepository: EventoRepository,
  ) { }

  @get('/eventos/{id}/opcions', {
    responses: {
      '200': {
        description: 'Array of Evento has many Opcion',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Opcion)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Opcion>,
  ): Promise<Opcion[]> {
    return this.eventoRepository.opciones(id).find(filter);
  }

  @post('/eventos/{id}/opcions', {
    responses: {
      '200': {
        description: 'Evento model instance',
        content: {'application/json': {schema: getModelSchemaRef(Opcion)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Evento.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Opcion, {
            title: 'NewOpcionInEvento',
            exclude: ['id'],
            optional: ['eventoId']
          }),
        },
      },
    }) opcion: Omit<Opcion, 'id'>,
  ): Promise<Opcion> {
    return this.eventoRepository.opciones(id).create(opcion);
  }

  @patch('/eventos/{id}/opcions', {
    responses: {
      '200': {
        description: 'Evento.Opcion PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Opcion, {partial: true}),
        },
      },
    })
    opcion: Partial<Opcion>,
    @param.query.object('where', getWhereSchemaFor(Opcion)) where?: Where<Opcion>,
  ): Promise<Count> {
    return this.eventoRepository.opciones(id).patch(opcion, where);
  }

  @del('/eventos/{id}/opcions', {
    responses: {
      '200': {
        description: 'Evento.Opcion DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Opcion)) where?: Where<Opcion>,
  ): Promise<Count> {
    return this.eventoRepository.opciones(id).delete(where);
  }
}

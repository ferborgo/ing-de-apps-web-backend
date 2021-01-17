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
  Invitado,
  OpcionElegida,
} from '../models';
import {InvitadoRepository} from '../repositories';

export class InvitadoOpcionElegidaController {
  constructor(
    @repository(InvitadoRepository) protected invitadoRepository: InvitadoRepository,
  ) { }

  @get('/invitados/{id}/opcion-elegidas', {
    responses: {
      '200': {
        description: 'Array of Invitado has many OpcionElegida',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(OpcionElegida)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<OpcionElegida>,
  ): Promise<OpcionElegida[]> {
    return this.invitadoRepository.opcionElegidas(id).find(filter);
  }

  @post('/invitados/{id}/opcion-elegidas', {
    responses: {
      '200': {
        description: 'Invitado model instance',
        content: {'application/json': {schema: getModelSchemaRef(OpcionElegida)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Invitado.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OpcionElegida, {
            title: 'NewOpcionElegidaInInvitado',
            exclude: ['id'],
            optional: ['invitadoId']
          }),
        },
      },
    }) opcionElegida: Omit<OpcionElegida, 'id'>,
  ): Promise<OpcionElegida> {
    return this.invitadoRepository.opcionElegidas(id).create(opcionElegida);
  }

  @patch('/invitados/{id}/opcion-elegidas', {
    responses: {
      '200': {
        description: 'Invitado.OpcionElegida PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OpcionElegida, {partial: true}),
        },
      },
    })
    opcionElegida: Partial<OpcionElegida>,
    @param.query.object('where', getWhereSchemaFor(OpcionElegida)) where?: Where<OpcionElegida>,
  ): Promise<Count> {
    return this.invitadoRepository.opcionElegidas(id).patch(opcionElegida, where);
  }

  @del('/invitados/{id}/opcion-elegidas', {
    responses: {
      '200': {
        description: 'Invitado.OpcionElegida DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(OpcionElegida)) where?: Where<OpcionElegida>,
  ): Promise<Count> {
    return this.invitadoRepository.opcionElegidas(id).delete(where);
  }
}

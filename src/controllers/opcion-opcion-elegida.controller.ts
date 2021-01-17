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
  Opcion,
  OpcionElegida,
} from '../models';
import {OpcionRepository} from '../repositories';

export class OpcionOpcionElegidaController {
  constructor(
    @repository(OpcionRepository) protected opcionRepository: OpcionRepository,
  ) { }

  @get('/opcions/{id}/opcion-elegidas', {
    responses: {
      '200': {
        description: 'Array of Opcion has many OpcionElegida',
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
    return this.opcionRepository.opcionElegidas(id).find(filter);
  }

  @post('/opcions/{id}/opcion-elegidas', {
    responses: {
      '200': {
        description: 'Opcion model instance',
        content: {'application/json': {schema: getModelSchemaRef(OpcionElegida)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Opcion.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OpcionElegida, {
            title: 'NewOpcionElegidaInOpcion',
            exclude: ['id'],
            optional: ['opcionId']
          }),
        },
      },
    }) opcionElegida: Omit<OpcionElegida, 'id'>,
  ): Promise<OpcionElegida> {
    return this.opcionRepository.opcionElegidas(id).create(opcionElegida);
  }

  @patch('/opcions/{id}/opcion-elegidas', {
    responses: {
      '200': {
        description: 'Opcion.OpcionElegida PATCH success count',
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
    return this.opcionRepository.opcionElegidas(id).patch(opcionElegida, where);
  }

  @del('/opcions/{id}/opcion-elegidas', {
    responses: {
      '200': {
        description: 'Opcion.OpcionElegida DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(OpcionElegida)) where?: Where<OpcionElegida>,
  ): Promise<Count> {
    return this.opcionRepository.opcionElegidas(id).delete(where);
  }
}

import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {OpcionElegida} from '../models';
import {OpcionElegidaRepository} from '../repositories';

export class OpcionElegidaController {
  constructor(
    @repository(OpcionElegidaRepository)
    public opcionElegidaRepository : OpcionElegidaRepository,
  ) {}

  @post('/opcion-elegidas', {
    responses: {
      '200': {
        description: 'OpcionElegida model instance',
        content: {'application/json': {schema: getModelSchemaRef(OpcionElegida)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OpcionElegida, {
            title: 'NewOpcionElegida',
            exclude: ['id'],
          }),
        },
      },
    })
    opcionElegida: Omit<OpcionElegida, 'id'>,
  ): Promise<OpcionElegida> {
    return this.opcionElegidaRepository.create(opcionElegida);
  }

  @get('/opcion-elegidas/count', {
    responses: {
      '200': {
        description: 'OpcionElegida model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(OpcionElegida) where?: Where<OpcionElegida>,
  ): Promise<Count> {
    return this.opcionElegidaRepository.count(where);
  }

  @get('/opcion-elegidas', {
    responses: {
      '200': {
        description: 'Array of OpcionElegida model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(OpcionElegida, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(OpcionElegida) filter?: Filter<OpcionElegida>,
  ): Promise<OpcionElegida[]> {
    return this.opcionElegidaRepository.find(filter);
  }

  @patch('/opcion-elegidas', {
    responses: {
      '200': {
        description: 'OpcionElegida PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OpcionElegida, {partial: true}),
        },
      },
    })
    opcionElegida: OpcionElegida,
    @param.where(OpcionElegida) where?: Where<OpcionElegida>,
  ): Promise<Count> {
    return this.opcionElegidaRepository.updateAll(opcionElegida, where);
  }

  @get('/opcion-elegidas/{id}', {
    responses: {
      '200': {
        description: 'OpcionElegida model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(OpcionElegida, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(OpcionElegida, {exclude: 'where'}) filter?: FilterExcludingWhere<OpcionElegida>
  ): Promise<OpcionElegida> {
    return this.opcionElegidaRepository.findById(id, filter);
  }

  @patch('/opcion-elegidas/{id}', {
    responses: {
      '204': {
        description: 'OpcionElegida PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OpcionElegida, {partial: true}),
        },
      },
    })
    opcionElegida: OpcionElegida,
  ): Promise<void> {
    await this.opcionElegidaRepository.updateById(id, opcionElegida);
  }

  @put('/opcion-elegidas/{id}', {
    responses: {
      '204': {
        description: 'OpcionElegida PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() opcionElegida: OpcionElegida,
  ): Promise<void> {
    await this.opcionElegidaRepository.replaceById(id, opcionElegida);
  }

  @del('/opcion-elegidas/{id}', {
    responses: {
      '204': {
        description: 'OpcionElegida DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.opcionElegidaRepository.deleteById(id);
  }
}

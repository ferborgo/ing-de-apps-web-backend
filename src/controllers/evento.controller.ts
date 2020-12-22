import {authenticate, TokenService} from '@loopback/authentication';
import {MyUserService, TokenServiceBindings, UserRepository, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {Evento} from '../models';
import {EventoRepository} from '../repositories';

export class EventoController {
  constructor(
    @repository(EventoRepository)
    public eventoRepository: EventoRepository,
    @repository(UserRepository)
    public userRepositoru: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
  ) { }

  @post('/eventos', {
    responses: {
      '200': {
        description: 'Evento model instance',
        content: {'application/json': {schema: getModelSchemaRef(Evento)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Evento, {
            title: 'NewEvento',
            exclude: ['id'],
          }),
        },
      },
    })
    evento: Omit<Evento, 'id'>,
  ): Promise<Evento> {
    return this.eventoRepository.create(evento);
  }

  @authenticate('jwt')
  @get('/eventos/count', {
    responses: {
      '200': {
        description: 'Evento model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Evento) where?: Where<Evento>,
  ): Promise<Count> {
    return this.eventoRepository.count(where);
  }

  @authenticate('jwt')
  @get('/eventos', {
    responses: {
      '200': {
        description: 'Array of Evento model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Evento, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Evento) filter?: Filter<Evento>,
  ): Promise<Evento[]> {
    return this.eventoRepository.find(filter);
  }


  @authenticate('jwt')
  @get('/eventos/user', {
    responses: {
      '200': {
        description: 'Array of Evento model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Evento, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findForUser(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Evento[]> {
    const id = currentUserProfile[securityId];

    const filter: Filter<Evento> = {
      include: [
        {
          relation: 'opciones'
        },
        {
          relation: 'invitados'
        }
      ],
      where: {
        usuarioCreadorID: id
      }
    }
    return this.eventoRepository.find(filter);
  }



  @patch('/eventos', {
    responses: {
      '200': {
        description: 'Evento PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Evento, {partial: true}),
        },
      },
    })
    evento: Evento,
    @param.where(Evento) where?: Where<Evento>,
  ): Promise<Count> {
    return this.eventoRepository.updateAll(evento, where);
  }

  @get('/eventos/{id}', {
    responses: {
      '200': {
        description: 'Evento model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Evento, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Evento, {exclude: 'where'}) filter?: FilterExcludingWhere<Evento>
  ): Promise<Evento> {
    return this.eventoRepository.findById(id, filter);
  }

  @patch('/eventos/{id}', {
    responses: {
      '204': {
        description: 'Evento PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Evento, {partial: true}),
        },
      },
    })
    evento: Evento,
  ): Promise<void> {
    await this.eventoRepository.updateById(id, evento);
  }

  @put('/eventos/{id}', {
    responses: {
      '204': {
        description: 'Evento PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() evento: Evento,
  ): Promise<void> {
    await this.eventoRepository.replaceById(id, evento);
  }

  @del('/eventos/{id}', {
    responses: {
      '204': {
        description: 'Evento DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.eventoRepository.deleteById(id);
  }

  @post('/eventos/{id}/auth')
  async eventoAuth(
    @param.path.string('id') id: string,
    @requestBody() args: {password: string},
  ): Promise<any> {
    const evento = await this.eventoRepository.findById(id);
    console.log('Args password: ', args.password);
    console.log('Evento password: ', evento.password);
    const res = evento.password == args.password;
    if (res) {
      return {
        mensaje: 'Todo ok'
      }
    } else {
      // https://loopback.io/doc/en/lb4/Controller.html
      const error = new HttpErrors[400];
      error.message = 'Contraseña incorrecta';
      throw error;
    }
  }
}

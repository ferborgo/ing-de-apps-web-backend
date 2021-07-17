import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema, FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import moment from 'moment';
import {Suscripcion} from '../models';
import {SuscripcionRepository} from '../repositories';

export class SuscripcionController {
  constructor(
    @repository(SuscripcionRepository)
    public suscripcionRepository: SuscripcionRepository,
    @inject(SecurityBindings.USER, {optional: true}) public user: UserProfile,
  ) { }

  @get('/suscripciones/count', {
    responses: {
      '200': {
        description: 'Suscripcion model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Suscripcion) where?: Where<Suscripcion>,
  ): Promise<Count> {
    return this.suscripcionRepository.count(where);
  }

  @patch('/suscripciones', {
    responses: {
      '200': {
        description: 'Suscripcion PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Suscripcion, {partial: true}),
        },
      },
    })
    suscripcion: Suscripcion,
    @param.where(Suscripcion) where?: Where<Suscripcion>,
  ): Promise<Count> {
    return this.suscripcionRepository.updateAll(suscripcion, where);
  }

  @get('/suscripciones/{id}', {
    responses: {
      '200': {
        description: 'Suscripcion model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Suscripcion, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Suscripcion, {exclude: 'where'}) filter?: FilterExcludingWhere<Suscripcion>
  ): Promise<Suscripcion> {
    return this.suscripcionRepository.findById(id, filter);
  }

  @patch('/suscripciones/{id}', {
    responses: {
      '204': {
        description: 'Suscripcion PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Suscripcion, {partial: true}),
        },
      },
    })
    suscripcion: Suscripcion,
  ): Promise<void> {
    await this.suscripcionRepository.updateById(id, suscripcion);
  }

  @put('/suscripciones/{id}', {
    responses: {
      '204': {
        description: 'Suscripcion PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() suscripcion: Suscripcion,
  ): Promise<void> {
    await this.suscripcionRepository.replaceById(id, suscripcion);
  }

  @del('/suscripciones/{id}', {
    responses: {
      '204': {
        description: 'Suscripcion DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.suscripcionRepository.deleteById(id);
  }

  @authenticate('jwt')
  @post('/suscripciones')
  async createSuscripcion(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile
  ): Promise<Suscripcion> {

    const id = currentUserProfile[securityId];

    const suscripcion = await this.suscripcionRepository.create({
      fecha: new Date().toString(),
      usuarioID: id
    });

    return suscripcion;
  }

  @authenticate('jwt')
  @get('/suscripciones', {
    responses: {
      '200': {
        description: 'Array of Suscripcion model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Suscripcion, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findForUser(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Suscripcion[]> {
    const id = currentUserProfile[securityId];

    return this.suscripcionRepository.find({where: {usuarioID: id}});
  }


  @authenticate('jwt')
  @get('suscripciones/mesActualPago')
  async mesPago(@inject(SecurityBindings.USER) currentUserProfile: UserProfile): Promise<boolean> {

    const id = currentUserProfile[securityId];

    const suscripciones = await this.suscripcionRepository.find({where: {usuarioID: id}});

    const sorted = suscripciones.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    const lastOne = sorted[sorted.length - 1];

    const diff = moment().diff(moment(lastOne.fecha), 'month');

    return diff < 1;
  }
}

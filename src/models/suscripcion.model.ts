import {Entity, model, property} from '@loopback/repository';

@model()
export class Suscripcion extends Entity {
  @property({
    type: 'date',
    required: true,
  })
  fecha: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true
  })
  usuarioID: string


  constructor(data?: Partial<Suscripcion>) {
    super(data);
  }
}

export interface SuscripcionRelations {
  // describe navigational properties here
}

export type SuscripcionWithRelations = Suscripcion & SuscripcionRelations;

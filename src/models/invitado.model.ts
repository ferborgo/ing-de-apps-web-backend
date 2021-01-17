import {Entity, model, property, hasMany} from '@loopback/repository';
import {OpcionElegida} from './opcion-elegida.model';

@model()
export class Invitado extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  creador: boolean;

  @property({
    type: 'string',
  })
  eventoId?: string;

  @hasMany(() => OpcionElegida)
  opcionElegidas: OpcionElegida[];

  constructor(data?: Partial<Invitado>) {
    super(data);
  }
}

export interface InvitadoRelations {
  // describe navigational properties here
}

export type InvitadoWithRelations = Invitado & InvitadoRelations;

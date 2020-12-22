import {Entity, hasMany, model, property} from '@loopback/repository';
import {Invitado} from './invitado.model';
import {Opcion} from './opcion.model';

@model()
export class Evento extends Entity {
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
    required: false,
  })
  descripcion: string;

  @property({
    type: 'string',
    required: true
  })
  password: string;

  @hasMany(() => Opcion)
  opciones: Opcion[];

  @hasMany(() => Invitado)
  invitados: Invitado[];

  @property({
    type: 'string',
    required: false
  })
  usuarioCreadorID: string

  constructor(data?: Partial<Evento>) {
    super(data);
  }
}

export interface EventoRelations {
  // describe navigational properties here
}

export type EventoWithRelations = Evento & EventoRelations;

import {Entity, model, property, hasMany} from '@loopback/repository';
import {OpcionElegida} from './opcion-elegida.model';

@model()
export class Opcion extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaInicio: string;

  @property({
    type: 'date',
    required: true,
  })
  fechaFinal: string;

  @property({
    type: 'string',
  })
  eventoId?: string;

  @hasMany(() => OpcionElegida)
  opcionElegidas: OpcionElegida[];

  constructor(data?: Partial<Opcion>) {
    super(data);
  }
}

export interface OpcionRelations {
  // describe navigational properties here
}

export type OpcionWithRelations = Opcion & OpcionRelations;

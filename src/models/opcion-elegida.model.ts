import {Entity, model, property} from '@loopback/repository';

@model()
export class OpcionElegida extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  invitadoId?: string;

  @property({
    type: 'string',
  })
  opcionId?: string;

  constructor(data?: Partial<OpcionElegida>) {
    super(data);
  }
}

export interface OpcionElegidaRelations {
  // describe navigational properties here
}

export type OpcionElegidaWithRelations = OpcionElegida & OpcionElegidaRelations;

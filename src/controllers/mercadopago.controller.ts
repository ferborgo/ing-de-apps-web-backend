// Uncomment these imports to begin using these cool features!

import {post, requestBody} from '@loopback/rest';

// import {inject} from '@loopback/core';
const mercadopago = require("mercadopago");

// mercadopago.configurations.setAccessToken("TEST-8486011498416739-032322-8896c65c021faa3becbbb9945cd3fd0a-175812900");

// Mis credenciales
// mercadopago.configure({
//   access_token: "TEST-8486011498416739-032322-8896c65c021faa3becbbb9945cd3fd0a-175812900"
// });

// Credenciales usuario prueba vendedor
mercadopago.configure({
  access_token: "TEST-5852615894997727-070723-ccb24edb354c8f37cb6468f9507bb2ce-787698969"
});


export class MercadopagoController {
  constructor() { }

  @post('/create_preference')
  async create(@requestBody() req: any): Promise<any> {
    console.log('req: ', req);
    let preference = {
      items: [{
        title: req.description,
        unit_price: Number(req.price),
        quantity: Number(req.quantity),
      }],
      back_urls: {
        "success": "http://localhost:4200/home/mercadopago/success",
        "failure": "http://localhost:4200/home/mercadopago/failure",
        "pending": "http://localhost:4200/home/mercadopago/pending"
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);
    console.log(response);
    return response;
  }

  @post('/create_default_preference')
  async createDefault(): Promise<any> {
    let preference = {
      items: [{
        title: 'Suscripción mensual',
        unit_price: 150,
        quantity: 1,
      }],
      back_urls: {
        "success": "http://localhost:4200",
        "failure": "http://localhost:4200",
        "pending": "http://localhost:4200"
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);
    console.log(response);
    return response;
  }
}

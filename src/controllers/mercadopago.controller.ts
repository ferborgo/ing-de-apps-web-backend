// Uncomment these imports to begin using these cool features!

import {post, requestBody} from '@loopback/rest';

// import {inject} from '@loopback/core';
const mercadopago = require("mercadopago");

mercadopago.configurations.setAccessToken("TEST-8486011498416739-032322-8896c65c021faa3becbbb9945cd3fd0a-175812900");

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
        "success": "http://localhost:8080/feedback",
        "failure": "http://localhost:8080/feedback",
        "pending": "http://localhost:8080/feedback"
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);
    console.log(response);
    return response;
  }
}

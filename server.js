'use strict';

const Hapi = require('hapi');
const req = require('request');

const server = new Hapi.Server();
server.connection({ 
  port: 8005,
  routes: {
    cors: true
  }
});

server.route({
  method: 'POST',
  path: '/sms',
  handler: function(request, reply) {
    req({
      url: 'http://wms1.wavecell.com/Send.asmx/SendMT',
      qs: {
        Destination: request.payload.from,
        Body: request.payload.message,
        AccountId: process.env.WC_ACCOUNT_ID,
        SubAccountId: process.env.WC_SUBACCOUNT_ID,
        Password: process.env.WC_PASSWORD,
        Source: 'wavecellTest',
        Encoding: 'Unicode',
        ScheduledDateTime: '',
        UMID: ''
      },
      method: 'GET' 
    }, function(error, response, body) {
      if (error) {
        console.log(error);
        return reply(error);
      }
      console.log(response);
      console.log(body);
      return reply({
        status: 'message sent'
      });
    });
  }
});

server.start(() => {
  console.log('Server running at:', server.info.uri);
});

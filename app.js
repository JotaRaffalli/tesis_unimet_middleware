/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('dotenv').load();

/* var middleware = require('botkit-middleware-watson')({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  workspace_id: process.env.WORKSPACE_ID,
  url: process.env.CONVERSATION_URL || 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2017-05-26'
}); */

var _context = {};


const watsonApiUrl = 'https://openwhisk.ng.bluemix.net/api/v1/web/diazdaniel%40correo.unimet.edu.ve_Tesis-DevSpace/assistant-with-discovery-openwhisk/assistant-with-discovery-sequence.json'

const openWhiskSequence = function (bot, message, next ) {

      console.log('Mensaje Recibido con exito: ', message);

      message.logged = true;

      if (message.text && message.type != 'self_message') {
        fetchSequence(message.text).then(function(responseJson) {
            next();
        });
    } else {
        next();
    }

}

const fetchSequence = function (incomingText) {

  const requestJson = JSON.stringify({
    input: {
      text: incomingText
    },
    context: _context
  });

  return fetch(watsonApiUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: requestJson
    }
  ).then((response) => {
    if(!response.ok) {
      throw response;
    }
    return(response.json());
  })
    .then((responseJson) => {

      _context = responseJson.context;

      console.log("Esta es la respuesta de la secuencia: ",responseJson);
      return(responseJson);

    }).catch(function(error) {
      throw error;
    });

}

module.exports = function(app) {
  if (process.env.USE_SLACK) {
    var Slack = require('./bot-slack');
    Slack.controller.middleware.receive.use(openWhiskSequence);
    Slack.bot.startRTM();
    console.log('Slack bot is live');
  }
  if (process.env.USE_FACEBOOK) {
    var Facebook = require('./bot-facebook');
    Facebook.controller.middleware.receive.use(openWhiskSequence);
    Facebook.controller.createWebhookEndpoints(app, Facebook.bot);
    console.log('Facebook bot is live');
  }
  if (process.env.USE_TWILIO) {
    var Twilio = require('./bot-twilio');
    Twilio.controller.middleware.receive.use(openWhiskSequence);
    Twilio.controller.createWebhookEndpoints(app, Twilio.bot);
    console.log('Twilio bot is live');
  }
  // Customize your Watson Middleware object's before and after callbacks.
  middleware.before = function(message, conversationPayload, callback) {
    callback(null, conversationPayload);
  }

  middleware.after = function(message, conversationResponse, callback) {
    callback(null, conversationResponse);
  }
};

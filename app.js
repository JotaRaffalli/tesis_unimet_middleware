// Dependencias
const fetch = require("node-fetch");
const admin = require('firebase-admin');

require('dotenv').load();




// se configura servidor express que tendrá el web sockets
// -------------------------------- FALLE --------------------------------
//require(__dirname + '/components/express_webserver.js')(controller);
//controller.middleware.receive.use(openWhiskSequence);


// Variables
var _context = {};
const watsonApiUrl = 'https://openwhisk.ng.bluemix.net/api/v1/web/diazdaniel%40correo.unimet.edu.ve_Tesis-DevSpace/assistant-with-discovery-openwhisk/assistant-with-discovery-sequence.json'



// Inicialización
admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": "tesis-unimetbot",
    "private_key_id": "ee8e07f198ab014f6f51467461a7651c4553344b",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCotrSLfxdMrQPU\nj/i2BlCvsjC9rzN6FvVojz7E3J60Zmgg9Z9P1q8pUWEVuReMyE+0uoPv80GBeJLv\nHq+5PPDxrpS2dy9wun7CZihpAZhGwsg0Hghdu66oyaaf0fsSk9aGFxdT585UOObX\nZoIjvyVeV0G/Z/uoHsAchtLslbWpO05XrVSmB1Dud8lD9vgECc5v8qQYwxEjg5QU\nm75xEgsyCyTL2dyoNygq3ZygZDqdw3jFqxcht1z/SN1hKz5Q8/TrpivUKHusNOKa\nbaUUjY69A2LncH5VpMnGgMdS61qtWmmFCAhUhr62+hhssZG4fIm9hlWcgFXPsyDx\nDtsIzkBpAgMBAAECggEADegRdbYiG4XfXPQJEifvGqxbbCc23QdrbxTvnZZ51nDi\ngGT+nrwZcBRvJjU9hbM1LrZ5DZxFeACSS/eBkIk/awxy4Z9tX6Nfs3JsPkuNW7fO\nfM1E70T7HpqQi3fpdByPgDoDCD2BOlv+Wx7t9zhYQjB7EOXnTnJKb4+Fb07fzHUe\nksaVV5cbPI0oAF+UZ2I82AKm0XsdvVjvP/wPda+ertNcQ+26eHzjHIiP+flHwbug\nL9q+LZ0FYpP0HCjCvFN3UCvv8J8D3JI1pn04q3QZnPp12eSeKQbCL1qZI+CRheOl\nkn8YxzhPyiC9roXpfdhSVD11yG7rXxqi2FQBEwiuoQKBgQDkw0BOK/ROH0n+QNiu\nlvxMPZ6X/f5mdOWHHrtmrdC+fysyNIVYTlvinhzCplhVynstmjJaMGXXC80njKcJ\nObIuaUYD1V2mIAb2wwbbDBpvmqiLWUBl51TLG1h5/dZwHiEC7G0OHX0lNqndtcQV\npMoHfIZWRsYuHmwHw2RzaBsznQKBgQC8zSTkcVVRTZitpxtoFsXYJmj0Tv61dwtl\n6kBJRf/6mS/8GlDlfW3qNaqN192/t+uaVeONoXUEsMonwAC0nOMDR74T4CIaeNdI\nN/DUDDRTr5K5BQT31/LE2P5i0ycML0Bwos9UhmlHfvYaVbPz49enech0lRn8kQ1h\nQpJb666EPQKBgQCg4Zf14f+ceXDGOMCqeFDTJXrFlcE2OPu6/Sf6XD8z2ad9VWZ5\n5hHE3EGJuwbgvtfGCG1k9CiLBievqsFGQadH8I1m4MVNsbR0ElBd+LMWzgO+jHQ3\ntmrxtDeTA6utieLZdYB0rtR2OW1ZGR3fwta6UR8AyiFSCd8bzpR0fUC0GQKBgCwE\n6IUap3m9TcuvGoS6SoaK7g2IHXrRtqacZ0CuQXB8JuPwfswC4o2o1YscuWbpytTB\nEb0D1/SwA3IhIgj6SzOIlpiruUfSxN7hrBTEg66/UMYylWXzw3aB4U3JTWFZ4vxf\n+VcLv6AbyeV59er3RGCX1FTaLqTkbOowS0+DM71BAoGBAJ/x/T0ZIuUZ5+BCCcbO\nhp3Khbwhkn3n+EPmoniUJt4H7T/eWRjBhqRnitnqOXwBD8Jqb3mehutcDNPTqctw\nGDSiHW+9ImNcG9rd6gkqSHlIsd1iY3+CT2SEAfamxDuxc4vLQWUqPYXGH3QZOWLK\nqdYniyVDKra8sR0121lzb642\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-qsc94@tesis-unimetbot.iam.gserviceaccount.com",
    "client_id": "109175614158571581444",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://accounts.google.com/o/oauth2/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qsc94%40tesis-unimetbot.iam.gserviceaccount.com"
  }),
  databaseURL: 'https://tesis-unimetbot.firebaseio.com/'
});

// Referencias a Firebase
var db = admin.database();
var refAsignaturas = db.ref("asignatura");
var refProfesores = db.ref("profesores");
var refDepartamentos = db.ref("departamentos");
var refDocumentos = db.ref("documentos");
var refEscuelas = db.ref("escuelas");
var refEstudiantes = db.ref("estudiantes");
var refRecordatorios = db.ref("recordatorios");
var refSecciones = db.ref("secciones");
var refCarreras = db.ref("carreras");


// Funciones

/**
 * Se conecta a la secuencia y le envía el mensaje que recibió
 * @param {bot} bot 
 * @param {json} message 
 * @param {object} next 
 */
const openWhiskSequence = function(bot, message, next) {

  console.log("********** PRIMERA FASE **********")
  console.log("Mensaje Recibido de canal con éxito: ", message);

  message.logged = true;
 

  if (!message.user) {
    console.log("Mensaje entrante sin usuario, next() y se continua...");
    next();
  } else {
    if (message.text && message.type != "self_message") {
      fetchSequence(message.text).then(  function(responseJson) {
        console.log("********** SEGUNDA FASE **********");
        console.log("Se le envía a watson el mensaje...");
        console.log("Esta es la respuesta: ",responseJson);

        message.watsonData = responseJson;
        message.watsonData.context.timezone = "America/Caracas"
        // Verifica propiedad action de la respuesta
        console.log("Esto es lo que tiene la propiedad action: ",responseJson.output.action);
        if ( responseJson.output.hasOwnProperty("action") && responseJson.output.action[0].name == "buscarCertificados" ) 
        {
          console.log("-----------------------------Action type: buscarCertificados------------------------------ ");
          let carnet = Number(responseJson.output.action[0].parameters.carnet);
          let certificadosArray = [];
          let userFullName = [];

          console.log("ESTE ES EL CARNET:",carnet);

          refEstudiantes.orderByChild('carnet').equalTo(carnet).on("value", function(snapshot) {
            let carrera = snapshot.child(carnet).val().carrera;
            userFullName = snapshot.child(carnet).val().nombre.split(' ') || null;
            let username = userFullName[0];
            message.watsonData.context.username = username || null;
            message.watsonData.context.carrera = carrera;
            refCarreras.orderByChild('nombre').equalTo(carrera).on("value", function(snapshot2) {
              let certfJSON = snapshot2.child(carrera).val().certificados;
              let keys = Object.keys(certfJSON);
              for (var i=0; i<keys.length; i++)
              {
                let k = keys[i];
                let nombreCert = certfJSON[k].nombre;
                certificadosArray.push(nombreCert);
              }

              message.watsonData.context.certificadosDeCarrera = certificadosArray;
              message.watsonData.output.action = null;
              certificadosArray = [];
              console.log("Nuevo mensaje enrriquecido, propiedad watsonData: ", message.watsonData)
              programmaticResponse(message.watsonData).then((respuesta) => {
                console.log("------------------- Se actualiza a watson con mensaje enrriquecido -----------------");
                console.log("Esta es la respuesta de watson despues de haberla enrriquecido: ", respuesta);
                message.watsonData = respuesta;
                bot.reply(message, message.watsonData.output.text.join('\n'));
              });
              next();
            }, function(error2) {
              // The callback failed.
              console.error("ERROR Q2 : ",error2);
              message.watsonData.context.callbackError = "No se contro carrera del estudiante en referencia de carreras.";
              programmaticResponse(message.watsonData).then((respuesta) => {
                if (message.watsonData.output.text != "")
                bot.reply(message, message.watsonData.output.text.join('\n'));
                next();
              });
            });
          }, function(error1) {
            // The callback failed.
            console.error("ERROR Q1 : ",error1);
            message.watsonData.context.callbackError = "Vaya! Al parecer no hay ningún estudiante con ese carnet, por favor intentelo de nuevo más tarde.";
              programmaticResponse(message.watsonData).then((respuesta) => {
                if (message.watsonData.output.text != "")
                bot.reply(message, message.watsonData.output.text.join('\n'));
                next();
              });
          });
          
            
        } else if (responseJson.output.hasOwnProperty("action") &&  responseJson.output.action[0].name == "buscarSalon")
        {
          console.log("-----------------------------Action type: buscarSalon------------------------------ ");
          
          let carnet = Number(responseJson.output.action[0].parameters.carnet);
          console.log("ESTE ES EL CARNET:",carnet);

          refProfesores.orderByChild('carnet').equalTo(carnet).on("value", function(snapshot) {

          }, function(error1) {
              // The callback failed.
              console.error("ERROR Q1 NO SE ENCONTRO PROFESOR : ",error1);
            });
          refEstudiantes.orderByChild('carnet').equalTo(carnet).on("value", function(snapshot) {

          }, function(error2) {
            // The callback failed.
            console.error("ERROR Q1 NO SE ENCONTRO ESTUDIANTE : ",error2);
          });

        } else 
        {
          next();
        }

      });
    } else 
    {
      next();
    }
  }
};

/**
 * Fetch con respuesta del programmatic call
 * @param {json} payload 
 */
const programmaticResponse = function (payload) {
  const requestJson = JSON.stringify(payload);
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

      return(responseJson)

    }).catch(function(error) {
      throw error;
    });

}



/**
 * Fetch al end-point de la secuencia
 * @param {string} incomingText 
 */
const fetchSequence = function (incomingText) {

  _context.timezone = "America/Caracas"
  const requestJson = JSON.stringify({
    input: {
      text: incomingText
    },
    context: _context, 
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

      return(responseJson);

    }).catch(function(error) {
      throw error;
    });

}

// ---------------- Main App ----------------
module.exports.main = function(app, controller) {
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

  controller.openSocketServer(controller.httpserver);
  controller.startTicking();
  controller.middleware.receive.use(openWhiskSequence);
  
 /*  controller.createWebhookEndpoints(app, Twilio.bot);  */

  // Personaliza acciones antes y después de las respuetsas de la llamada.
  openWhiskSequence.before = function(message, conversationPayload, callback) {
    callback(null, conversationPayload);
  }

  openWhiskSequence.after = function(message, conversationResponse, callback) {
    callback(null, conversationResponse);
  }
};

exports.openWhiskSequence = openWhiskSequence;
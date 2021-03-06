// Dependencias
const fetch = require("node-fetch");
const admin = require('firebase-admin');
const Botkit = require("botkit");
const Q = require('q');
const ejs = require('ejs');
const Mailgun = require('mailgun-js');
const moment = require('moment')
require('dotenv').load();




// se configura servidor express que tendrá el web sockets
// -------------------------------- FALLE --------------------------------
//require(__dirname + '/components/express_webserver.js')(controller);

// Variables
var _context = { timezone: "America/Caracas" };
const watsonApiUrl = 'https://openwhisk.ng.bluemix.net/api/v1/web/diazdaniel%40correo.unimet.edu.ve_Tesis-DevSpace/assistant-with-discovery-openwhisk/assistant-with-discovery-sequence.json'
let watsonDataAux;


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
var refElectivas = db.ref("electivas");

// Funciones

const buscarElectivas = function (trimestre, tipoElectivas) {
  lista = []
  return new Promise(resolve => {
    refElectivas.child(trimestre).orderByKey().startAt(tipoElectivas).endAt(tipoElectivas + "\uf8ff").on("value", function (snapshot) {
      if (snapshot.val() != null) {
        console.log("SNAAAAAAAAP", snapshot.val())
        resultado = snapshot.val();
        let keys = Object.keys(resultado);
        for (var z = 0; z < keys.length; z++) {
          let k = keys[z];
          lista.push(
            resultado[k].nombre
          );
        }
        resolve(lista)
      } else {
        reject(null)
      }
    }, function (error) {
      // The callback failed.
      console.error("ERROR NO SE HALLARON ELECTIVAS : ", error1);
      reject(console.log('failed: ' + error1));
    });
  })
}




/**
 * Customiza un poco la lista de correos a enviar
 * @param {array} listaEstudiantes 
 */
const reminderCreator = function (email, evento, tiempo) {
  var mailingList = []
  // Extraer un template de html
  tiempoAux=moment(tiempo).format("H:mm:ss DD/MM/YY")

  ejs.renderFile(__dirname + '/emailTemplates/recordatorio.ejs', {
    nombre: email[0].nombre,
    mensaje: evento,
    tiempo: tiempo

  }, (err, _html) => {
    if (err) console.log(err)
    else if (_html) {
      console.log("Html generado");
      mailingList.push({
        user: email[0].correo,
        html: _html
      });
    }
  });


  return mailingList;
}

/**
 * 
 * Busca el correo del profesor * 
 * 
 */

const buscarCorreo = function (persona, carnet) {

  return new Promise(resolve => {
    var email = []
    if (persona == "Profesor") {
      console.log("Entro a Profesor", carnet)
      refProfesores.orderByChild("carnet")
        .equalTo(carnet)
        .on(
          "value",
          function (snapshot) {
            console.log(snapshot.val())
            if (snapshot.val() != null) {
              let key = Object.keys(snapshot.val())
              console.log(key)
              console.log("correo", snapshot.child(key).val().correo)

              email.push(
                {
                  correo: snapshot.child(key).val().correo,
                  nombre: snapshot.child(key).val().nombre
                })
              resolve(email)
            } else {
              console.log("nulo")
              resolve(null)
            }
          }, function (err) {
            console.log(err)
            resolve(null)
          }); //TODO: ERROR HANDLING;
    } else {
      console.log("Entro a Estudiantes")
      refEstudiantes.orderByChild("carnet")
        .equalTo(carnet)
        .on(
          "value",
          function (snapshot) {
            console.log(snapshot.val())
            if (snapshot.val() != null) {
              let key = Object.keys(snapshot.val())
              console.log(key)
              console.log("correo", snapshot.child(key).val().correo)

              email.push(
                {
                  correo: snapshot.child(key).val().correo,
                  nombre: snapshot.child(key).val().nombre
                })
              resolve(email)
            } else {
              console.log("nulo")
              resolve(null)
            }
          }, function (err) {
            console.log(err)
            resolve(null)
          });//TODO: ERROR HANDLING;

    }
  })
}


/**
 * Extrae lista de alumnos de una asignatura en particular
 * @param {number} carnet 
 * @param {string} _asignatura 
 */
const mailUsers = function (carnet, _asignatura) {

  let listaEstudiantes = [];
  var deffered = Q.defer();

  refProfesores.orderByChild("carnet").equalTo(carnet).on("value", function (snapshot) {
    if (snapshot.val() !== null) {
      let seccionesJSON = snapshot.child(carnet).val().secciones;
      let profesorFullName = snapshot.child(carnet).val().nombre
      let keys = Object.keys(seccionesJSON);
      for (var i = 0; i < keys.length; i++) {
        let k = keys[i];
        if (seccionesJSON[k].asignatura == _asignatura) {
          let estudiantesJSON = seccionesJSON[k].estudiantes;
          let keys2 = Object.keys(estudiantesJSON);
          for (var z = 0; z < keys2.length; z++) {
            let k2 = keys2[z];
            listaEstudiantes.push(
              {
                correo: estudiantesJSON[k2].correo,
                nombre: estudiantesJSON[k2].nombre
              }
            );
          }
        }
      }
      let retornoPromesa = {
        listaEstudiantes: listaEstudiantes,
        profesorFullName: profesorFullName
      }

      deffered.resolve(retornoPromesa);
    }
    else {
      // No se encontró profesor con ese carnet
      message.watsonData.context.isProfessor = false;
      // Avisa a watson que hubo un error
      programmaticResponse(message.watsonData).then(
        respuesta => {
          message.watsonData = respuesta;
          bot.reply(message, message.watsonData.output.text.join("\n")
          );
          deffered.reject(message.watsonData.context.isProfessor);
        }
      );
    }
  },
    function (error1) {
      // The callback failed.
      console.error("ERROR Q1 NO SE ENCONTRO PROFESOR : ", error1);
      deffered.reject(console.log('failed: ' + error1));

    });
  return deffered.promise;
};

/**
 * Customiza un poco la lista de correos a enviar
 * @param {array} listaEstudiantes 
 */
const mailCreator = function (listaEstudiantes, mensaje, _asignaruta) {
  var mailingList = [];
  for (var i = 0; i < listaEstudiantes.length; i++) {
    // Extraer un template de html
    ejs.renderFile(__dirname + '/emailTemplates/correo.ejs', {
      nombre: listaEstudiantes[i].nombre,
      mensaje: mensaje,
      asignatura: _asignaruta

    }, (err, _html) => {
      if (err) console.log(err)
      else if (_html) {
        console.log("Html generado");
        mailingList.push({
          user: listaEstudiantes[i].correo,
          html: _html
        });
      }
    });
  }

  return mailingList;
}

const mailSender = function (userEmail, subject, _html, mailDay, mensaje, profesorFullName) {
  // setup promises
  var deffered = Q.defer();
  // create new mailgun instance with credentials
  var mailgun = new Mailgun({
    apiKey: process.env.mailgun_api,
    domain: process.env.mailgun_domain
  });
  // setup the basic mail data
  let fromName = profesorFullName.replace(/ /g, '')
  console.log("Este es el nombre completo: ", fromName)
  mailDay = moment(mailDay).utcOffset(240).format("ddd, DD MMM YYYY H:mm:ss z")
  console.log("Esta es la hora de envío", mailDay)
  var mailData = {
    from: fromName + "@unimetbot.edu.ve",
    to: userEmail,
    subject: subject,
    html: _html,
    // two other useful parameters
    // testmode lets you make API calls
    // without actually firing off any emails
    'o:testmode': false,
    // you can specify a delivery time
    // up to three days in advance for
    // your emails to send.
    'o:deliverytime': mailDay// 'Thu, 13 Oct 2011 18:02:00 GMT' TODO: EXTRAER FECHA Y PARSEARLA AL FORMATO CORRECTO
  };
  // send your mailgun instance the mailData
  mailgun.messages().send(mailData, function (err, body) {
    // If err console.log so we can debug
    if (err) {
      console.log('failed: ' + err)
      deffered.reject(err);
    } else {
      deffered.resolve(body)
    }
  });

  return deffered.promise;
};


/**
 * Se conecta a la secuencia y le envía el mensaje que recibió
 * @param {bot} bot 
 * @param {json} message 
 * @param {object} next 
 */
const openWhiskSequence = function (bot, message, next) {
  console.log("********** PRIMERA FASE **********");
  console.log("Mensaje Recibido de canal con éxito: ", message);

  message.logged = true;

  if (!message.user) {
    console.log("Mensaje entrante sin usuario, next() y se continua...");
    next();
  } else {
    if (message.text && message.type != "self_message") {
      let user = message.user;
      fetchSequence(message.text, user).then(function (responseJson) {
        console.log("********** SEGUNDA FASE **********");
        console.log("Se le envía a watson el mensaje...");
        console.log("Esta es la respuesta: ", responseJson);

        message.watsonData = responseJson;
        message.watsonData.context.timezone = "America/Caracas";
        watsonDataAux = message.watsonData;
        // Verifica propiedad action de la respuesta
        console.log(
          "Esto es lo que tiene la propiedad action: ",
          responseJson.output.action
        );
        if (
          responseJson.output.hasOwnProperty("action") &&
          responseJson.output.action[0].name == "buscarCertificados"
        ) {
          console.log(
            "-----------------------------Action type: buscarCertificados------------------------------ "
          );
          let carnet = Number(responseJson.output.action[0].parameters.carnet);
          let certificadosArray = [];
          let userFullName = [];

          console.log("ESTE ES EL CARNET:", carnet);

          refEstudiantes
            .orderByChild("carnet")
            .equalTo(carnet)
            .on("value", function (snapshot) {
              if (snapshot.val() !== null) {
                //user exists, do something
                let carrera = snapshot.child(carnet).val().carrera;
                userFullName = snapshot
                  .child(carnet)
                  .val()
                  .nombre.split(" ") || null;
                let username = userFullName[0];
                message.watsonData.context.username = username || null;
                message.watsonData.context.carrera = carrera;
                refCarreras
                  .orderByChild("nombre")
                  .equalTo(carrera)
                  .on("value", function (snapshot2) {
                    if (snapshot.val() !== null) {
                      let certfJSON = snapshot2
                        .child(carrera)
                        .val().certificados;
                      let keys = Object.keys(certfJSON);
                      for (var i = 0; i < keys.length; i++) {
                        let k = keys[i];
                        let nombreCert = certfJSON[k].nombre;
                        certificadosArray.push(nombreCert);
                      }

                      message.watsonData.context.certificadosDeCarrera = certificadosArray;
                      message.watsonData.output.action = null;
                      certificadosArray = [];
                      console.log("Nuevo mensaje enrriquecido, propiedad watsonData: ", message.watsonData);
                      programmaticResponse(message.watsonData).then(
                        respuesta => {
                          console.log(
                            "------------------- Se actualiza a watson con mensaje enrriquecido -----------------"
                          );
                          console.log(
                            "Esta es la respuesta de watson despues de haberla enrriquecido: ",
                            respuesta
                          );
                          message.watsonData = respuesta;
                          bot.reply(
                            message,
                            message.watsonData.output.text.join(
                              "\n"
                            )
                          );
                        }
                      );
                      next();
                    } else {
                      message.watsonData.context.callbackError =
                        "No se contro carrera del estudiante en referencia de carreras.";
                      programmaticResponse(message.watsonData).then(respuesta => {
                        message.watsonData = respuesta
                        next();
                      });
                    }
                  }, function (error2) {
                    // The callback failed.
                    console.error("ERROR Q2 : ", error2);
                    message.watsonData.context.callbackError = error2;
                    programmaticResponse(message.watsonData).then(respuesta => {
                      message.watsonData = respuesta
                      next();
                    });
                  }
                  );
              } else {
                message.watsonData.context.callbackError =
                  "Vaya! Al parecer no hay ningún estudiante con ese carnet, por favor intentelo de nuevo más tarde.";
                programmaticResponse(message.watsonData).then(respuesta => {
                  message.watsonData = respuesta/*
                    if (respuesta.output.text != "")
                      bot.reply(
                        message,
                        message.watsonData.output.text.join("\n")
                      );*/
                  next();
                });
              }
            }, function (error1) {
              // The callback failed.
              console.error("ERROR Q1 : ", error1);
              message.watsonData.context.callbackError = error1;
              programmaticResponse(message.watsonData).then(respuesta => {
                message.watsonData = respuesta
                next();
              });
            }
            );
        } else if (
          responseJson.output.hasOwnProperty("action") &&
          responseJson.output.action[0].name == "buscarSalon"
        ) {
          console.log(
            "-----------------------------Action type: buscarSalon------------------------------ "
          );
          let userFullName = []
          let resultado
          let resultados = []
          let horario
          let _asignatura = responseJson.output.action[0].parameters.asignatura
          let carnet = Number(responseJson.output.action[0].parameters.carnet);
          let isProfessor = responseJson.output.action[0].parameters.isProfessor;
          console.log("ESTE ES EL CARNET: ", carnet);
          console.log("ASIGNATURA A BUSCAR: ", _asignatura);
          /* bot.reply(
            message,
            message.watsonData.output.text.join(
              "\n"
            )
          ); */
          if (isProfessor) {
            refProfesores
              .orderByChild("carnet")
              .equalTo(carnet)
              .on(
                "value",
                function (snapshot) {
                  if (snapshot.val() !== null) {
                    userFullName = snapshot.child(carnet).val().nombre.split(" ") || null;
                    let username = userFullName[0];
                    message.watsonData.context.username = username || null;
                    let seccionesJSON = snapshot.child(carnet).val().secciones;
                    let keys = Object.keys(seccionesJSON);
                    for (var i = 0; i < keys.length; i++) {
                      let k = keys[i];
                      if (seccionesJSON[k].asignatura == _asignatura) {
                        console.log("Se encontro asignatura")
                        resultados.push( seccionesJSON[k].aula+' - '+seccionesJSON[k].horario )
                      }
                    }
                    if (resultados.length > 1) {
                      message.watsonData.context.resultados = resultados
                    }
                    else {
                      message.watsonData.context.resultado = resultados[0]
                    }

                    if(resultados.length == 0 ) message.watsonData.context.noSectionFound  = true;
                    console.log("EL AULA Y SECCIÓN DE LA MATERIA ESCOGIDA ES:  ",message.watsonData.context.resultado);
                    programmaticResponse(message.watsonData).then(
                      respuesta => {
                        console.log(
                          "------------------- Se actualiza a watson con mensaje enrriquecido -----------------"
                        );
                        console.log(
                          "Esta es la respuesta de watson despues de haberla enrriquecido: ",
                          respuesta
                        );
                        message.watsonData = respuesta;
                        bot.reply(
                          message,
                          message.watsonData.output.text.join(
                            "\n"
                          )
                        );
                      }
                    );
                  }
                  else {
                    message.watsonData.context.noProfessorFound = true;
                    programmaticResponse(message.watsonData).then(
                      respuesta => {
                        message.watsonData = respuesta;
                        bot.reply(
                          message,
                          message.watsonData.output.text.join(
                            "\n"
                          )
                        );
                      }
                    );

                  }
                },
                function (error1) {
                  // The callback failed.
                  console.error("ERROR Q1 NO SE ENCONTRO PROFESOR : ", error1);
                }
              );
          }
          else {
            refSecciones.
            orderByChild("asignatura").
            on("value",function (snapshot) {
                  if (snapshot.val() !== null) {
                    snapshot.forEach(function(data) {
                      if (data.val().asignatura == _asignatura) {
                        resultados.push(data.val().aula + ' - ' + data.val().horario)
                        console.log("Se encontro asignatura")
                      }
                      console.log("Seccion:  " + data.key + " aula:  " + data.val().aula);
                    });

                    if (resultados.length > 1) {
                      message.watsonData.context.resultados = resultados
                    }
                    else {
                      message.watsonData.context.resultado = resultados[0]
                    }
                    if(resultados.length == 0 ) message.watsonData.context.noSectionFound  = true;
                    console.log("EL AULA Y SECCIÓN DE LA MATERIA ESCOGIDA ES:  ",resultados[0]);
                    programmaticResponse(message.watsonData).then(
                      respuesta => {
                        console.log(
                          "------------------- Se actualiza a watson con mensaje enrriquecido -----------------"
                        );
                        console.log(
                          "Esta es la respuesta de watson despues de haberla enrriquecido: ",
                          respuesta
                        );
                        message.watsonData = respuesta;
                        bot.reply(
                          message,
                          message.watsonData.output.text.join(
                            "\n"
                          )
                        );
                      }
                    );
                  }
                  else {
                    message.watsonData.context.noSectionFound = true;
                    programmaticResponse(message.watsonData).then(
                      respuesta => {
                        message.watsonData = respuesta;
                        bot.reply(
                          message,
                          message.watsonData.output.text.join(
                            "\n"
                          )
                        );
                      }
                    );
                  }
                },
                function (error2) {
                  // The callback failed.
                  console.error("ERROR Q1 NO SE ENCONTRO ESTUDIANTE : ", error2);
                }
              );
          }
        } else if (
          responseJson.output.hasOwnProperty("action") &&
          responseJson.output.action[0].name == "enviarCorreo"
        ) {
          console.log("-----------------------------Action type: enviarCorreo------------------------------ ");
          bot.reply(message, message.watsonData.output.text.join("\n"));
          let _asignatura = responseJson.output.action[0].parameters.asignatura;
          let carnet = Number(responseJson.output.action[0].parameters.carnet);
          let subject = responseJson.output.action[0].parameters.asunto;
          let mensaje = responseJson.output.action[0].parameters.mensaje;
          let mailDay = responseJson.output.action[0].parameters.mailDay || moment(Date.now()).add(30, 's').toDate(); // TODO: EXTRAER FECHA (Dejar que dani lo haga)
          mailDay = moment(mailDay).format("ddd, DD MMM YYYY H:mm:ss");
          mailDay = mailDay.concat(" GMT");
          console.log("ESTE ES MAIL DAY", mailDay);
          console.log("ESTE ES SUBJETC", subject);
          console.log("ESTE ES MENSAJE", mensaje);
          console.log("ESTA ES ASIGNATURA", _asignatura);
          console.log("ESTE ES EL CARNET:", carnet);
          // TODO: MANEJAR ERRORES DE FECHA QUE SE PASA DEL MÁXIMO DE DIAS
          mailUsers(carnet, _asignatura)
            .then(function (retornoPromesa) {
              // Crear la lista de correos
              let listaEstudiantes = retornoPromesa.listaEstudiantes
              let profesorFullName = retornoPromesa.profesorFullName
              console.log("ëste es el professorFM", profesorFullName)
              if (profesorFullName) // Significa que si existe el profesor
              {
                console.log("ESTA ES LA LISTA DE ESTUDIANTES", listaEstudiantes);
                var mailing = mailCreator(listaEstudiantes, mensaje, _asignatura);
                // para cada usuario de la lista configura un email a enviar
                for (var i = 0; i < mailing.length; i++) {
                  console.log("RECORRIENDO LISTA", i)
                  // envía el email a cada usuario con su template personalizado de ejs
                  mailSender(mailing[i].user, subject, mailing[i].html, mailDay, mensaje, profesorFullName)
                    .then(function (res) {
                      console.log("MENSAJE ENVIADO", res);
                    })
                    .catch(function (err) {
                      console.log("ERROR AL ENVIAR MENSAJE: " + err)
                      message.watsonData.context.errorEnviando = true;
                      programmaticResponse(message.watsonData).then(
                        respuesta => {
                          message.watsonData = respuesta;
                          bot.reply(message, message.watsonData.output.text.join("\n")
                          );
                        }
                      );
                    })
                }
                message.watsonData.context.confirmation = true
                programmaticResponse(message.watsonData).then(
                  respuesta => {
                    message.watsonData = respuesta;
                    bot.reply(message, message.watsonData.output.text.join("\n")
                    );
                  }
                );
              } else {
                next()
              }
            })
        } else if (
          responseJson.output.hasOwnProperty("action") &&
          responseJson.output.action[0].name == "recordatorio"
        ) {
          console.log("-----------------------------Action type: recordatorios------------------------------ ");
          let fecha = responseJson.output.action[0].parameters.fecha
          fecha = moment(fecha).format("ddd, DD MMM YYYY")
          let evento = responseJson.output.action[0].parameters.evento
          let hora = responseJson.output.action[0].parameters.hora
          let carnet = Number(responseJson.output.action[0].parameters.carnet)
          let persona = responseJson.output.action[0].parameters.persona
          console.log("ESTA ES EL CARNET", carnet)
          console.log("ESTA ES LA FECHA", fecha)
          console.log("ESTA ES LA HORA", hora)
          console.log("ESTE ES EL EVENTO", evento)
          console.log("ESTA ES LA PERSONA", persona)

          let horaEnvio = fecha.concat(" ", hora, " GMT")
          console.log("ENVIARRRR", horaEnvio)
          let subject = "Recordatorio"
          buscarCorreo(persona, carnet).then(email => {
            console.log(email)
            if (email) {
              tiempo = moment(horaEnvio).format("ddd, DD MMM YYYY H:mm")
              var mailing = reminderCreator(email, evento, tiempo);
              mailSender(mailing[0].user, subject, mailing[0].html, horaEnvio, evento, "recordatorio")
                .then(function (res) {
                  console.log("MENSAJE ENVIADO", res);
                  message.watsonData.context.success = true
                  programmaticResponse(message.watsonData).then(
                    respuesta => {
                      message.watsonData = respuesta;
                      bot.reply(message, message.watsonData.output.text.join("\n")
                      );
                    }
                  );
                  next();
                })
                .catch(function (err) {
                  console.log("ERROR AL ENVIAR MENSAJE: " + err)
                  message.watsonData.context.errorEnviando = true;
                  programmaticResponse(message.watsonData).then(
                    respuesta => {
                      message.watsonData = respuesta;
                      bot.reply(message, message.watsonData.output.text.join("\n")
                      );
                    }
                  );
                })

            } else {
              console.log("No hay correo")
              message.watsonData.context.errorCorreo = true
              message.watsonData.context.errorMensaje = "No se encontró un correo para el carnet indicado, intente más tarde"
              programmaticResponse(message.watsonData).then(
                respuesta => {
                  message.watsonData = respuesta;
                  bot.reply(message, message.watsonData.output.text.join("\n")
                  );
                }
              );
            }
          })


          //next()
        } else if (
          responseJson.output.hasOwnProperty("action") &&
          responseJson.output.action[0].name == "buscarElectivas"
        ) {
          let trimestre = responseJson.output.action[0].parameters.trimestre || "1718-3"
          let tipoElectivas = responseJson.output.action[0].parameters.tipoElectiva
          //responseJson.output.action[0].parameters.trimestre ? trimestre=responseJson.output.action[0].parameters.trimestre : tipoElectivas=responseJson.output.action[0].parameters.trimestreActual
          console.log("TRIMESTRE ", trimestre, " Tipo ELECTIVCAS", tipoElectivas)

          buscarElectivas(trimestre, tipoElectivas).then(resultado => {
            console.log("Hacer Listaaaa", resultado)
            message.watsonData.context.listaElectivas = resultado
            console.log("WAAAATSON", watsonData)
            programmaticResponse(message.watsonData).then(
              respuesta => {
                console.log(
                  "------------------- Se actualiza a watson con mensaje enrriquecido -----------------"
                );
                console.log(
                  "Esta es la respuesta de watson despues de haberla enrriquecido: ",
                  respuesta
                );
                message.watsonData = respuesta;
                bot.reply(
                  message,
                  message.watsonData.output.text.join(
                    "\n"
                  )
                );
              }
            );
          }).catch(err => {
            message.watsonData.context.errorCallback = true;
            programmaticResponse(message.watsonData).then(
              respuesta => {
                message.watsonData = respuesta;
                bot.reply(message, message.watsonData.output.text.join("\n")
                );
              }
            );
          })
          responseJson.output.action = null
        } else {
          next();
        }
      });
    } else {
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
    if (!response.ok) {
      throw response;
    }
    return (response.json());
  })
    .then((responseJson) => {

      _context = responseJson.context;

      return (responseJson)

    }).catch(function (error) {
      throw error;
    });

}



/**
 * Fetch al end-point de la secuencia
 * @param {string} incomingText 
 */
const fetchSequence = function (incomingText, user) {

  _context.timezone = "America/Caracas"
  const requestJson = JSON.stringify({
    input: {
      text: incomingText
    },
    context: _context,
    currentUser: user
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
    if (!response.ok) {
      throw response;
    }
    return (response.json());
  })
    .then((responseJson) => {

      _context = responseJson.context;

      return (responseJson);

    }).catch(function (error) {
      throw error;
    });

}

// ---------------- Main App ----------------
module.exports.main = function(app, webController) {
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

  // Abre sockets para que aplicaciones que posean la arquitectura se conecten al middleware
  webController.openSocketServer(webController.httpserver);



  // Configura controlador web para que use la secuencia de OpenWhisk para el flujo de información

  webController.middleware.receive.use(openWhiskSequence);
  // Personaliza el mensaje del sistema bot web antes de enviarlo
  webController.middleware.send.use(function(bot, message, next) {
    message.watsonResponseData = watsonDataAux;
    next();

});

// Arranca el sistema bot para procesar los webhooks y websockets cada 1.5 segundos (lo despierta para evitar lag)
webController.startTicking();
// Configura el sistema bot web para accionarse al evento de mensaje entrante
webController.hears(['.*'], 'message_received', function(bot, message) {
    if (message.watsonError) {
      console.log(message.watsonError);
      bot.reply(message, message.watsonError.description || message.watsonError.error);
    } else if (message.watsonData && 'output' in message.watsonData) {
      bot.reply(message, message.watsonData.output.text.join('\n'));
    } else {
      console.log('Error: Se recivió un mensaje con el formato erroneo. Verificar conexión con IBM watson');
      bot.reply(message, "Lo sentimos, pero por razones técnicas no podemos atenderle en estos momentos.");
    }
  });

  // Personaliza acciones antes y después de las respuetsas de la llamada.
  openWhiskSequence.before = function (message, conversationPayload, callback) {
    callback(null, conversationPayload);
  }

  openWhiskSequence.after = function (message, conversationResponse, callback) {
    callback(null, conversationResponse);
  }
};

exports.openWhiskSequence = openWhiskSequence;
require('dotenv').config()
const {
  createBot,
  createProvider,
  createFlow,
} = require("@bot-whatsapp/bot");

const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");

const welcomeFlow = require("./flows/welcome.flow");
const vendedorFlow = require('./flows/vendedor.flow')
const expertoFlow = require('./flows/experto.flow')
const pagarFlow = require('./flows/pagar.flow')

const {init} = require('bot-ws-plugin-openai');
const ServerAPI = require('./http');
/**
 * Configuracion de Plugin
 */
const employeesAddonConfig = {
  model: "gpt-3.5-turbo-16k",
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY,
};
const employeesAddon = init(employeesAddonConfig);

employeesAddon.employees([
  {
    name: "EMPLEADO_VENDEDOR",
    description:
      "Soy Rob el vendedor amable encargado de atentender si tienes intencion de comprar o interesado en algun producto, mis respuestas son breves.",
    flow: vendedorFlow,
  },
  {
    name: "EMPLEADO_EXPERTO",
    description:
      "Saludos, mi nombre es Leifer.Soy el engargado especializado en resolver tus dudas sobre nuestro curso de chatbot, el cual está desarrollado con Node.js y JavaScript. Este curso está diseñado para facilitar la automatización de ventas en tu negocio. Te proporcionaré respuestas concisas y directas para maximizar tu entendimiento.",
    flow: expertoFlow,
  },
  {
    name: "EMPLEADO_PAGAR",
    description:
      "Saludos, mi nombre es Juan encargado de generar los links de pagos necesarios cuando un usuario quiera hacer la recarga de puntos a la plataforma de cursos.",
    flow: pagarFlow,
  }
])

/**
 * 
 */


const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    welcomeFlow,
    vendedorFlow,
    expertoFlow,
    pagarFlow
  ]);
  
  const adapterProvider = createProvider(BaileysProvider);

  const httpServer = new ServerAPI(adapterProvider, adapterDB)

  const configBot = {
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  }

  const configExtra = {
    extensions:{
      employeesAddon
    }
  }

  await createBot(configBot,configExtra);
  httpServer.start()
};

main();

const { addKeyword } = require("@bot-whatsapp/bot");
const { handlerStripe } = require("../services/stripe");
/**
 * Flujo de bienvenida
 */
module.exports = addKeyword('pagar')
.addAnswer('dame un momento para generarte un link de pago...')
.addAnswer('¿Cual es tu email?',{capture:true}, async (ctx, {fallBack, flowDynamic}) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = ctx.body;
    const phone = ctx.from

    if(!emailRegex.test(email)){
        return fallBack(`Debe ser un mail correcto! esto *${email}* NO es un mail`)
    }

    const link = await handlerStripe(phone, email)
    await flowDynamic(`Aqui tienes el link: ${link.url}`)
})

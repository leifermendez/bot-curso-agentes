const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
/**
 * Flujo de bienvenida
 */
module.exports = addKeyword(EVENTS.ACTION)
.addAction(async (_, {state, flowDynamic}) =>{
    const currentState = state.getMyState()
    return flowDynamic(currentState.answer)
})
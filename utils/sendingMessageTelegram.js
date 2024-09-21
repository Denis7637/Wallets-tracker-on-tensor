const createMessageTG = require('./createMassageTG')

async function sendingMessageTelegram(tr, wallet, bot) {
    const massage = await createMessageTG(tr, wallet)
    await bot.sendMessage(wallet.telegramID, massage, { parse_mode: 'Markdown', disable_web_page_preview: true })
}

module.exports = sendingMessageTelegram
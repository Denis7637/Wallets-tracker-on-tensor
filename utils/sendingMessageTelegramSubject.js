const createMessageTG = require('./createMassageTG')

async function sendingMessageTelegramSubject(tr, wallet, bot) {
    const massage = await createMessageTG(tr, wallet)
    const telegramID = wallet.telegramID.split('_')[0]
    const numeric_id = wallet.telegramID.split('_')[1]
    let message_thread_id1 = Number(numeric_id);
    if (message_thread_id1 != 1) {
        await bot.sendMessage(telegramID, massage, {
            parse_mode: 'Markdown',
            disable_web_page_preview: false,
            message_thread_id: message_thread_id1
        });
    } else {
        await bot.sendMessage(telegramID, massage, { parse_mode: 'Markdown', disable_web_page_preview: true })
    }
}

module.exports = sendingMessageTelegramSubject
const fs = require('fs')
const fetch = require('node-fetch')
const TelegramBot = require('node-telegram-bot-api');

const getLastTR = require('./utils/getLastTR')
const sendingMessageTelegram = require('./utils/sendingMessageTelegram')
const sendingMessageTelegramSubject = require('./utils/sendingMessageTelegramSubject')
const sendingMessageDiscord = require('./utils/sendingMessageDiscord')

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'))

const { telegram_token, delay, error_delay } = config.config
const wallets = config.wallets

bot = new TelegramBot(telegram_token, { polling: false });

async function main(bot, delay, wallets, error_delay) {
    const lastTR = {}
    for (wallet of wallets) {
        const walletTR = await getLastTR(wallet.wallet, error_delay)
        lastTR[wallet.wallet] = {
            txId: walletTR[0].txId,
            wallet_name: wallet.wallet_name
        }
        if (wallet.telegramID.includes('_')) {
            await sendingMessageTelegramSubject(walletTR[0], wallet, bot);
        } else {
            await sendingMessageTelegram(walletTR[0], wallet, bot);
        }
    }
    for (item of wallets) {
        console.log(`${item.wallet_name}: ${item.wallet} sand ${item.telegramID}`)
    }
    while (true) {
        for (const wallet of wallets) {
            const walletTR = await getLastTR(wallet.wallet, error_delay)
            
            if (walletTR.length > 0 && walletTR[0].txId !== lastTR[wallet.wallet].txId) {
                console.log(`New transaction detected for wallet ${wallet.wallet}`)

                for (const tr of walletTR) {
                    if (tr.txId === lastTR[wallet.wallet].txId) {
                        break
                    }
                    console.log(`Processing new transaction: ${tr.txId}`)

                    if (wallet.telegramID.includes('_')) {
                        await sendingMessageTelegramSubject(tr, wallet, bot);
                    } else {
                        await sendingMessageTelegram(tr, wallet, bot);
                    }
                }
                lastTR[wallet.wallet] = {
                    txId: walletTR[0].txId,
                    wallet_name: wallet.wallet_name
                }
                console.log(lastTR)
            }
        }
        await new Promise(resolve => setTimeout(resolve, delay))
    }
}


main(bot, delay, wallets, error_delay)
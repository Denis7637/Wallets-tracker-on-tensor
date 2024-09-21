async function createMassageTG(tr, wallet) {
    let trTipe
    let emogi
    if (wallet.wallet == tr.buyerId) {
        trTipe = 'BUY'
        emogi = '🟢'
    } else {
        trTipe = 'SELL'
        emogi = '🔴'
    }
    let NFTname = tr.mint.name
    let wallet_name = wallet.wallet_name
    let NFTprise = tr.grossAmount / 1000000000;

    massage = `[${emogi}](https://www.tensor.trade/trade/tensorians) [${wallet_name}](https://www.tensor.trade/portfolio?wallet=${wallet.wallet})  \n` +
              `${trTipe}  ${NFTname}\n` +
              `${trTipe}  for  ${NFTprise} sol\n` +
              `Collection  -  [URL](https://www.tensor.trade/trade/${tr.mint.slug})`
    return massage
}

module.exports = createMassageTG
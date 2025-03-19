import { Address, Cell, TonClient, WalletContractV5R1, beginCell, storeStateInit } from '@ton/ton'
import { mnemonicNew, mnemonicToWalletKey } from "@ton/crypto"
import fs from 'fs';

// Suffixes to look for IN TON WALLET ADDRESS
const endings = "TEXT"
async function main() {
  let i = 1;
  let j = 1;

  while (true) {
    console.log(`Iteration ${i++}, ${j}`);

    const words = await mnemonicNew();
    const adminKeys = await mnemonicToWalletKey(words);

    // Create a V6R1 wallet
    const adminWallet = WalletContractV5R1.create({
      publicKey: adminKeys.publicKey,
    });

    // Convert address to a human-readable (non-bounceable, url-safe) form // GOOD FOR TON WALLET ADDR ONLY
    const addressString = adminWallet.address.toString({
      urlSafe: true,      
      bounceable: false,  
      testOnly: false     
    });

    // Check if address ends with one of the desired suffixes
    if (addressString.slice(-4).toUpperCase().includes(endings)) {
      console.log("Found address:", addressString);
      console.log("Mnemonic:", words.join(" "));

      // Append result to a text file (creates file if it doesn't exist)
      fs.appendFileSync(
        'found_addresses.txt',
        `Iteration: ${i}\nAddress: ${addressString}\nMnemonic: ${words.join(" ")}\n\n`
      );
      j++
      // If you only want to find one and stop, uncomment the line below:
      // break;
    }
  }
}

// Show which suffixes we’re searching
console.log('Looking for suffixes:', endings);
main();


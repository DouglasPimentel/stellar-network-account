import dotenv from "dotenv";
import { Keypair, Server, TransactionBuilder, Networks, Operation, BASE_FEE } from "stellar-sdk";

dotenv.config();

const ACCOUNT_SECRET_KEY = process.env.ACCOUNT_SECRET_KEY;
const URL_SERVER = process.env.URL_SERVER || "https://horizon-testnet.stellar.org";

const questKeypair = Keypair.fromSecret(`${ACCOUNT_SECRET_KEY}`);
const newKeyPair = Keypair.random();


(async () => {
  const server = new Server(URL_SERVER);
  const questAccount = await server.loadAccount(questKeypair.publicKey());
  const transactionValue = "100";

  let transaction = new TransactionBuilder(
    questAccount,
    {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    },
  ).addOperation(
      Operation.createAccount({
        destination: newKeyPair.publicKey(),
        startingBalance: transactionValue,
      }),
    ).setTimeout(30).build();

  transaction.sign(questKeypair);

  try {
    let res = await server.submitTransaction(transaction);
    console.log(`Transaction Successful! Hash: ${res.hash}`);
  } catch (error) {
    console.log(`${error}. More details:\n${JSON.stringfy(error.response.data.extras, null, 2)}`);
  }
})();

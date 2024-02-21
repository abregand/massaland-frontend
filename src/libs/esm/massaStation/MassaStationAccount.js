import { argsToBase64, uint8ArrayToBase64 } from "../utils/argsToBase64";
import {
  MASSA_STATION_URL,
  MASSA_STATION_ACCOUNTS_URL,
} from "./MassaStationProvider";
import { getRequest, postRequest } from "./RequestHandler";
import { MAX_GAS_CALL } from "@massalabs/web3-utils";
import { encode as base58Encode } from "bs58check";

/**
 * The maximum allowed gas for a read operation
 */
const MAX_READ_BLOCK_GAS = BigInt(4_294_967_295);
/**
 * This module contains the MassaStationAccount class. It is responsible for representing an account in
 * the MassaStation wallet.
 *
 * @remarks
 * This class provides methods to interact with MassaStation account's {@link balance} and to {@link sign} messages.
 *
 */
export class MassaStationAccount {
  _providerName;
  _address;
  _name;
  /**
   * This constructor takes an object of type IAccountDetails and a providerName string as its arguments.
   *
   * @param address - The address of the account.
   * @param name - The name of the account.
   * @param providerName - The name of the provider.
   * @returns An instance of the Account class.
   *
   * @remarks
   * - The Account constructor takes an object of type IAccountDetails and a providerName string as its arguments.
   * - The IAccountDetails object contains the account's address and name.
   * - The providerName string identifies the provider that is used to interact with the blockchain.
   */
  constructor({ address, name }, providerName) {
    this._address = address;
    this._name = name;
    this._providerName = providerName;
  }
  /**
   * @returns The address of the account.
   */
  address() {
    return this._address;
  }
  /**
   * @returns The name of the account.
   */
  name() {
    return this._name;
  }
  /**
   * @returns The name of the provider.
   */
  providerName() {
    return this._providerName;
  }
  /**
   * This method aims to retrieve the account's balance.
   *
   * @returns A promise that resolves to an object of type IAccountBalanceResponse. It contains the account's balance.
   */
  async balance() {
    let signOpResponse = null;
    try {
      signOpResponse = await getRequest(
        `${MASSA_STATION_URL}massa/addresses?attributes=balance&addresses=${this._address}`
      );
    } catch (ex) {
      console.error(`MassaStation account balance error`);
      throw ex;
    }
    if (signOpResponse.isError || signOpResponse.error) {
      throw signOpResponse.error;
    }
    const balance =
      signOpResponse.result.addressesAttributes[this._address].balance;
    return {
      finalBalance: balance.final,
      candidateBalance: balance.pending,
    };
  }
  /**
   * This method aims to sign an operation.
   *
   * @param data - The operation data to be signed.
   * @returns An IAccountSignResponse object. It contains the signature of the message.
   */
  async sign(data) {
    let signOpResponse = null;
    // TODO: Massa Station has 2 endpoints sign (to sign operation) and signMessage (to sign a message).
    // To fix the current implementation we provide a dumb description and set DisplayData to true but it
    // must this feature must be implemented in the future.
    const signData = {
      description: "",
      message: data.toString(),
      DisplayData: true,
    };
    try {
      signOpResponse = await postRequest(
        `${MASSA_STATION_ACCOUNTS_URL}/${this._name}/signMessage`,
        signData
      );
    } catch (ex) {
      console.error(`MassaStation account signing error`);
      throw ex;
    }
    if (signOpResponse.isError || signOpResponse.error) {
      throw signOpResponse.error;
    }
    const signature = base58Encode(
      Buffer.from(signOpResponse.result.signature, "base64")
    );
    return {
      publicKey: signOpResponse.result.publicKey,
      base58Encoded: signature,
    };
  }
  /**
   * This method aims to buy rolls on behalf of the sender.
   *
   * @param amount - The amount of rolls to be bought.
   * @param fee - The fee to be paid for the transaction execution by the node.
   * @returns An ITransactionDetails object. It contains the operationId on the network.
   */
  async buyRolls(amount, fee) {
    let buyRollsOpResponse = null;
    const url = `${MASSA_STATION_ACCOUNTS_URL}/${this._name}/rolls`;
    const body = {
      fee: fee.toString(),
      amount: amount.toString(),
      side: "buy",
    };
    try {
      buyRollsOpResponse = await postRequest(url, body);
    } catch (ex) {
      console.error(`MassaStation account: error while buying rolls: ${ex}`);
      throw ex;
    }
    if (buyRollsOpResponse.isError || buyRollsOpResponse.error) {
      throw buyRollsOpResponse.error;
    }
    return buyRollsOpResponse.result;
  }
  /**
   * This method aims to sell rolls on behalf of the sender.
   *
   * @param amount - The amount of rolls to be sold.
   * @param fee - The fee to be paid for the transaction execution by the node.
   * @returns An ITransactionDetails object. It contains the operationId on the network.
   */
  async sellRolls(amount, fee) {
    let sellRollsOpResponse = null;
    const url = `${MASSA_STATION_ACCOUNTS_URL}/${this._name}/rolls`;
    const body = {
      fee: fee.toString(),
      amount: amount.toString(),
      side: "sell",
    };
    try {
      sellRollsOpResponse = await postRequest(url, body);
    } catch (ex) {
      console.error(`MassaStation account: error while selling rolls: ${ex}`);
      throw ex;
    }
    if (sellRollsOpResponse.isError || sellRollsOpResponse.error) {
      throw sellRollsOpResponse.error;
    }
    return sellRollsOpResponse.result;
  }
  /**
   * This method aims to transfer MAS on behalf of the sender to a recipient.
   *
   * @param amount - The amount of MAS (in the smallest unit) to be transferred.
   * @param fee - The fee to be paid for the transaction execution (in the smallest unit).
   * @returns An ITransactionDetails object. It contains the operationId on the network.
   */
  async sendTransaction(amount, recipientAddress, fee) {
    let sendTxOpResponse = null;
    const url = `${MASSA_STATION_ACCOUNTS_URL}/${this._name}/transfer`;
    const body = {
      fee: fee.toString(),
      amount: amount.toString(),
      recipientAddress: recipientAddress,
    };
    try {
      sendTxOpResponse = await postRequest(url, body);
    } catch (ex) {
      console.error(
        `MassaStation account: error while sending transaction: ${ex}`
      );
      throw ex;
    }
    if (sendTxOpResponse.isError || sendTxOpResponse.error) {
      throw sendTxOpResponse.error;
    }
    return sendTxOpResponse.result;
  }
  /**
   * This method aims to interact with a smart contract deployed on the MASSA blockchain.
   *
   * @remarks
   * If dryRun.dryRun is true, the method will dry run the smart contract call and return an
   * IContractReadOperationResponse object which contains all the information about the dry run
   * (state changes, gas used, etc.)
   *
   * @param contractAddress - The address of the smart contract.
   * @param functionName - The name of the function to be called.
   * @param parameter - The parameters as an Args object to be passed to the function.
   * @param amount - The amount of MASSA coins to be sent to the contract (in the smallest unit).
   * @param fee - The fee to be paid for the transaction execution (in the smallest unit).
   * @param maxGas - The maximum amount of gas to be used for the transaction execution.
   * @param nonPersistentExecution - The dryRun object to be passed to the function.
   *
   * @returns if 'nonPersistentExecution' is true, it returns an IContractReadOperationResponse object.
   * Otherwise, it returns an ITransactionDetails object which contains the operationId on the network.
   *
   */
  async callSC(
    contractAddress,
    functionName,
    parameter,
    coins,
    fee,
    maxGas,
    nonPersistentExecution = false
  ) {
    if (nonPersistentExecution) {
      return this.nonPersistentCallSC(
        contractAddress,
        functionName,
        parameter,
        maxGas
      );
    }
    // convert parameter to base64
    let args = "";
    if (parameter instanceof Uint8Array) {
      args = uint8ArrayToBase64(parameter);
    } else {
      args = argsToBase64(parameter);
    }
    let CallSCOpResponse = null;
    const url = `${MASSA_STATION_URL}cmd/executeFunction`;
    const body = {
      nickname: this._name,
      name: functionName,
      at: contractAddress,
      args,
      coins: Number(coins),
      fee: fee ? fee.toString() : "0",
      // If maxGas is not provided, estimation will be done by MS
      maxGas: maxGas ? maxGas.toString() : "",
      async: true,
    };
    try {
      CallSCOpResponse = await postRequest(url, body);
    } catch (ex) {
      console.log(
        `MassaStation account: error while interacting with smart contract: ${ex}`
      );
      throw ex;
    }
    if (CallSCOpResponse.isError || CallSCOpResponse.error) {
      throw CallSCOpResponse.error;
    }
    return CallSCOpResponse.result;
  }
  async getNodeUrlFromMassaStation() {
    // get the node url from MassaStation
    let nodesResponse = null;
    let node = "";
    try {
      nodesResponse = await getRequest(`${MASSA_STATION_URL}massa/node`);
      if (nodesResponse.isError || nodesResponse.error) {
        throw nodesResponse.error.message;
      }
      // transform nodesResponse.result to a json and then get the "url" property
      const nodes = nodesResponse.result;
      node = nodes.url;
    } catch (ex) {
      throw new Error(`MassaStation nodes retrieval error: ${ex}`);
    }
    return node;
  }
  async nonPersistentCallSC(contractAddress, functionName, parameter, maxGas) {
    const node = await this.getNodeUrlFromMassaStation();
    // Gas amount check
    if (maxGas > MAX_READ_BLOCK_GAS) {
      throw new Error(`
        The gas submitted ${maxGas.toString()} exceeds the max. allowed block gas of 
        ${MAX_READ_BLOCK_GAS.toString()}
        `);
    }
    // convert parameter to an array of numbers
    let argumentArray = [];
    if (parameter instanceof Uint8Array) {
      argumentArray = Array.from(parameter);
    } else {
      argumentArray = Array.from(parameter.serialize());
    }
    // setup the request body
    const data = {
      max_gas: maxGas ? Number(maxGas) : MAX_GAS_CALL,
      target_address: contractAddress,
      target_function: functionName,
      parameter: argumentArray,
      caller_address: this._address,
    };
    const body = [
      {
        jsonrpc: "2.0",
        method: "execute_read_only_call",
        params: [[data]],
        id: 0,
      },
    ];
    // returns operation ids
    let jsonRpcCallResult = [];
    try {
      let resp = await postRequest(node, body);
      if (resp.isError || resp.error) {
        throw resp.error.message;
      }
      jsonRpcCallResult = resp.result;
    } catch (ex) {
      throw new Error(
        `MassaStation account: error while interacting with smart contract: ${ex}`
      );
    }
    if (jsonRpcCallResult.length <= 0) {
      throw new Error(
        `Read operation bad response. No results array in json rpc response. Inspect smart contract`
      );
    }
    if (jsonRpcCallResult[0].result.Error) {
      throw new Error(jsonRpcCallResult[0].result.Error);
    }
    return {
      returnValue: new Uint8Array(jsonRpcCallResult[0].result[0].result.Ok),
      info: jsonRpcCallResult[0],
    };
  }
}
//# sourceMappingURL=MassaStationAccount.js.map

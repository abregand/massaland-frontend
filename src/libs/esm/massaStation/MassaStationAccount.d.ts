/// <reference types="node" />
import {
  IAccountBalanceResponse,
  IAccountDetails,
  ITransactionDetails,
} from "..";
import { IAccountSignOutput } from "../account/AccountSign";
import { IAccount } from "../account/IAccount";
import { Args, IContractReadOperationResponse } from "@massalabs/web3-utils";

/**
 * This module contains the MassaStationAccount class. It is responsible for representing an account in
 * the MassaStation wallet.
 *
 * @remarks
 * This class provides methods to interact with MassaStation account's {@link balance} and to {@link sign} messages.
 *
 */
export declare class MassaStationAccount implements IAccount {
  private _providerName;
  private _address;
  private _name;
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
  constructor({ address, name }: IAccountDetails, providerName: string);
  /**
   * @returns The address of the account.
   */
  address(): string;
  /**
   * @returns The name of the account.
   */
  name(): string;
  /**
   * @returns The name of the provider.
   */
  providerName(): string;
  /**
   * This method aims to retrieve the account's balance.
   *
   * @returns A promise that resolves to an object of type IAccountBalanceResponse. It contains the account's balance.
   */
  balance(): Promise<IAccountBalanceResponse>;
  /**
   * This method aims to sign an operation.
   *
   * @param data - The operation data to be signed.
   * @returns An IAccountSignResponse object. It contains the signature of the message.
   */
  sign(data: Buffer | Uint8Array | string): Promise<IAccountSignOutput>;
  /**
   * This method aims to buy rolls on behalf of the sender.
   *
   * @param amount - The amount of rolls to be bought.
   * @param fee - The fee to be paid for the transaction execution by the node.
   * @returns An ITransactionDetails object. It contains the operationId on the network.
   */
  buyRolls(amount: bigint, fee: bigint): Promise<ITransactionDetails>;
  /**
   * This method aims to sell rolls on behalf of the sender.
   *
   * @param amount - The amount of rolls to be sold.
   * @param fee - The fee to be paid for the transaction execution by the node.
   * @returns An ITransactionDetails object. It contains the operationId on the network.
   */
  sellRolls(amount: bigint, fee: bigint): Promise<ITransactionDetails>;
  /**
   * This method aims to transfer MAS on behalf of the sender to a recipient.
   *
   * @param amount - The amount of MAS (in the smallest unit) to be transferred.
   * @param fee - The fee to be paid for the transaction execution (in the smallest unit).
   * @returns An ITransactionDetails object. It contains the operationId on the network.
   */
  sendTransaction(
    amount: bigint,
    recipientAddress: string,
    fee: bigint
  ): Promise<ITransactionDetails>;
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
  callSC(
    contractAddress: string,
    functionName: string,
    parameter: Uint8Array | Args,
    coins: bigint,
    fee?: bigint,
    maxGas?: bigint,
    nonPersistentExecution?: boolean
  ): Promise<ITransactionDetails | IContractReadOperationResponse>;
  getNodeUrlFromMassaStation(): Promise<string>;
  nonPersistentCallSC(
    contractAddress: string,
    functionName: string,
    parameter: Uint8Array | Args,
    maxGas?: bigint
  ): Promise<IContractReadOperationResponse>;
}
//# sourceMappingURL=MassaStationAccount.d.ts.map

/// <reference types="node" />

/** Polyfills */
import { IProvider } from "./provider/IProvider";

export declare enum AvailableCommands {
  ProviderListAccounts = "LIST_ACCOUNTS",
  ProviderDeleteAccount = "DELETE_ACCOUNT",
  ProviderImportAccount = "IMPORT_ACCOUNT",
  ProviderGetNodesUrls = "GET_NODES_URLS",
  ProviderGetNetwork = "GET_NETWORK",
  AccountBalance = "ACCOUNT_BALANCE",
  AccountSign = "ACCOUNT_SIGN",
  ProviderGenerateNewAccount = "GENERATE_NEW_ACCOUNT",
  AccountSellRolls = "ACCOUNT_SELL_ROLLS",
  AccountBuyRolls = "ACCOUNT_BUY_ROLLS",
  AccountSendTransaction = "ACCOUNT_SEND_TRANSACTION",
  AccountCallSC = "ACCOUNT_CALL_SC",
}
export interface ITransactionDetails {
  operationId: string;
}
/**
 * Get the list of providers that are available to interact with.
 *
 * @param retry - If true, will retry to get the list of providers if none are available.
 * @param pollInterval - The timeout in milliseconds to wait between retries. default is 2000ms.
 * @param timeout - The timeout in milliseconds to wait before giving up. default is 3000ms.
 *
 * @returns An array of providers.
 */
export declare function providers(
  retry?: boolean,
  timeout?: number,
  pollInterval?: number
): Promise<IProvider[]>;
/**
 * Manually register a provider to interact with.
 *
 * @param name - The name of the provider.
 * @param id - The id of the HTML element that is used to communicate with the provider.
 */
export declare function registerProvider(name: string, id?: string): void;
export declare function getProviderByName(
  providerName: string
): Promise<IProvider | undefined>;
export { AllowedRequests, AllowedResponses } from "./connector";
export {
  IAccountDetails,
  IAccountBalanceRequest,
  IAccountBalanceResponse,
  IAccountSignRequest,
  IAccountSignResponse,
  IAccount,
  Account,
  IAccountRollsRequest,
  IAccountSendTransactionRequest,
  IAccountCallSCRequest,
} from "./account";
export {
  EAccountDeletionResponse,
  EAccountImportResponse,
  IAccountDeletionRequest,
  IAccountDeletionResponse,
  IAccountImportRequest,
  IAccountImportResponse,
  IProvider,
  Provider,
} from "./provider";
export { IMassaStationWallet } from "./massaStation/MassaStationProvider";
export { MassaStationAccount } from "./massaStation/MassaStationAccount";
export { connectBearby, disconnectBearby } from "./bearbyWallet/BearbyConnect";
//# sourceMappingURL=index.d.ts.map

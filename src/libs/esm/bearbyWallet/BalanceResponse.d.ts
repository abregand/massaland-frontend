export interface BalanceResponse {
  result: {
    address: string;
    thread: number;
    final_balance: string;
    final_roll_count: number;
    final_datastore_keys: Array<any>;
    candidate_balance: string;
    candidate_roll_count: number;
    candidate_datastore_keys: Array<any>;
    deferred_credits: Array<any>;
    next_block_draws: Array<any>;
    next_endorsement_draws: Array<any>;
    created_blocks: Array<string>;
    created_operations: Array<string>;
    created_endorsements: Array<any>;
    cycle_infos: Array<cycleInfos>;
  };
}
interface cycleInfos {
  cycle: number;
  is_final: boolean;
  ok_count: number;
  nok_count: number;
  active_rolls: any;
}
export {};
//# sourceMappingURL=BalanceResponse.d.ts.map
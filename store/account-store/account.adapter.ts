import { createEntityAdapter } from "@reduxjs/toolkit";
import {
  AccountAdapeterParams,
  MemoryAdapterParams,
} from "../../types/store.types";

const accountAdapter = createEntityAdapter<AccountAdapeterParams>({
  selectId: (model) => model.username,
  sortComparer: (account1, account2) =>
    account1.username.localeCompare(account2.username),
});

export const { selectById: selectAccountById } = accountAdapter.getSelectors();
export const {
  addMany: addManyAccounts,
  addOne: addOneAccount,
  removeOne: removeOneAccount,
  removeMany: removeManyAccounts,
  removeAll: removeAllAccounts,
  updateOne: updateOneAccount,
  updateMany: updateManyAccounts,
  upsertOne: upsertOneAccount,
  upsertMany: upsertManyAccounts,
  getInitialState: getAccountAdapterInitialState,
} = accountAdapter;

const memoryAdapter = createEntityAdapter<MemoryAdapterParams>({
  selectId: (model) => model.id,
  sortComparer: (memory1, memory2) => memory1.id.localeCompare(memory2.id),
});

export const { selectById: selectMemoryById } = memoryAdapter.getSelectors();
export const {
  addMany: addManyMemories,
  addOne: addOneMemory,
  removeOne: removeOneMemory,
  removeMany: removeManyMemories,
  removeAll: removeAllMemories,
  updateOne: updateOneMemory,
  updateMany: updateManyMemories,
  upsertOne: upsertOneMemory,
  upsertMany: upsertManyMemories,
  getInitialState: getMemoryAdapterInitialState,
} = memoryAdapter;

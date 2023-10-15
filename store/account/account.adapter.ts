import { createEntityAdapter } from "@reduxjs/toolkit";
import { AccountAdapterParams } from "../../types/store.types";

const accountAdapter = createEntityAdapter<AccountAdapterParams>({
  selectId: (model) => model.username,
  sortComparer: (account1, account2) =>
    account1._id.localeCompare(account2._id),
});

export const { selectById: selectAccountById } = accountAdapter.getSelectors();
export const {
  addMany: addManyAccounts,
  addOne: addOneAccount,
  removeOne: removeOneAccount,
  removeMany: removeMayAccounts,
  removeAll: removeAllAccounts,
  updateOne: updateOneAccount,
  updateMany: updateManyAccount,
  upsertOne: upsertOneAccount,
  upsertMany: upsertManyAccount,
  getInitialState: getAccountInitialState,
} = accountAdapter;

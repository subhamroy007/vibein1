import { createEntityAdapter } from "@reduxjs/toolkit";
import { AccountParams } from "../../types/utility.types";

const accountAdapter = createEntityAdapter<AccountParams>({
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

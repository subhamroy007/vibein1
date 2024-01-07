import { createEntityAdapter } from "@reduxjs/toolkit";
import { ThunkError } from "../../types/utility.types";
import { ThunkState } from "../../types/store.types";

export type RequestAdapterParams = {
  id: string;
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT";
  requestParams?: any;
  responseParams?: any;
  error?: ThunkError;
  statusCode?: number;
  startTimestamp?: number;
  endTimestamp?: number;
  state: ThunkState;
};

const requestAdapter = createEntityAdapter<RequestAdapterParams>({
  selectId: (model) => model.id,
  sortComparer: (model1, model2) => model1.id.localeCompare(model2.id),
});

export const { selectById: selectRequestById } = requestAdapter.getSelectors();
export const {
  addMany: addManyRequests,
  addOne: addOneRequest,
  removeOne: removeOneRequest,
  removeMany: removeMayRequests,
  removeAll: removeAllRequests,
  updateOne: updateOneRequest,
  updateMany: updateManyRequest,
  upsertOne: upsertOneRequest,
  upsertMany: upsertManyRequest,
  getInitialState: getRequestInitialState,
} = requestAdapter;

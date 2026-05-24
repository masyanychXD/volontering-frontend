import {BaseRecord, DataProvider, GetListParams, GetListResponse} from "@refinedev/core";
import {MOCK_EVENTS} from "@/constants/mock-data.ts";

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({ resource}: GetListParams): Promise<GetListResponse<TData>> => {
    if(resource !== "events") return { data: [] as TData[], total: 0};

    return {
      data: MOCK_EVENTS as unknown as TData[],
      total: MOCK_EVENTS.length,
    }
  },

  getOne: async () => {throw new Error('This function is not present in mock') },
  create: async () => {throw new Error('This function is not present in mock') },
  update: async () => {throw new Error('This function is not present in mock') },
  deleteOne: async () => {throw new Error('This function is not present in mock') },

  getApiUrl: () => ''
}

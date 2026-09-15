import { baseApi } from './baseApi';
import { BillPayload, Bill } from '../../types/bill.type';

export const contractorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitBill: builder.mutation<Bill, BillPayload>({
      query: (body) => ({ url: '/contractor/bills', method: 'POST', body }),
    })
  }),
});

export const { useSubmitBillMutation, } = contractorApi;
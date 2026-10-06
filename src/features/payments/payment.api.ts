import { ApiResponse } from '../../api/api.type';
import { baseApi } from '../../api/baseApi';
import { ENDPOINTS } from '../../api/endpoints';
import { InitiatePaymentData, InitiatePaymentRequest } from './payment.types';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    initiatePayment: builder.mutation<InitiatePaymentData, InitiatePaymentRequest>({
      query: body => ({
        url: ENDPOINTS.PAYMENTS.PAYU_INITIATE,
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<InitiatePaymentData>) => response.response!,
    }),
  }),
});

export const { useInitiatePaymentMutation } = paymentApi;
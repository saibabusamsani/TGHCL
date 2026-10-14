import { ApiDataResponse, ApiResponse } from '../../api/api.type';
import { baseApi } from '../../api/baseApi';
import { ENDPOINTS } from '../../api/endpoints';
import { Beneficiary, BeneficiaryInstallmentSummary } from './project.type';

const projectApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getBeneficiaryDetails: builder.query<Beneficiary[], void>({
      query: () => ({
        url: ENDPOINTS.PROJECTS.BENEFICIARY_DETAILS,
        method: 'GET'
      }),
      transformResponse: (result: ApiDataResponse<Beneficiary[]>) => result.response.data,
    }),
    getBeneficiaryInstallmentSummary: builder.query<BeneficiaryInstallmentSummary, { beneficiaryId: string }>({
      query: ({ beneficiaryId }) => ({
        url: ENDPOINTS.PROJECTS.BENEFICIARY_INSTALLMENTS,
        method: 'GET',
        params: { beneficiaryId },
      }),
      transformResponse: (result: ApiResponse<BeneficiaryInstallmentSummary>) => result.response,
    }),
  }),
});

export const {
  useGetBeneficiaryDetailsQuery,
  useGetBeneficiaryInstallmentSummaryQuery
} = projectApi;
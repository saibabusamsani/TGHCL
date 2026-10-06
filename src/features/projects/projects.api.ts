import { ApiDataResponse } from '../../api/api.type';
import { baseApi } from '../../api/baseApi';
import { ENDPOINTS } from '../../api/endpoints';
import { Beneficiary } from './project.type';

const projectApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getBeneficiaryDetails: builder.query<Beneficiary[], void>({
      query: () => ({
        url: ENDPOINTS.PROJECTS.BENEFICIARY_DETAILS,
        method: 'GET'
      }),
      transformResponse: (result: ApiDataResponse<Beneficiary[]>) => result.response.data,
    }),
  }),
});

export const {
  useGetBeneficiaryDetailsQuery,
} = projectApi;
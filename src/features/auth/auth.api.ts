import { baseApi } from '../../api/baseApi';
import { ENDPOINTS } from '../../api/endpoints';
import { LoginPayload, User } from '../../types/auth.type';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginEmployee: builder.mutation<User, LoginPayload>({
      query: (payload) => ({
        method: 'POST',
        url: ENDPOINTS.AUTH.LOGIN,
        body: payload,
      }),
    }),
    logoutEmployee:builder.mutation<void,void>({
      query:()=>({
        method:"POST",
        url:ENDPOINTS.AUTH.LOGOUT
      })
    })
  }),
});

export const { useLoginEmployeeMutation,useLogoutEmployeeMutation } = authApi;
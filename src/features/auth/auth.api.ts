import { ApiResponse } from '../../api/api.type';
import { baseApi } from '../../api/baseApi';
import { ENDPOINTS } from '../../api/endpoints';
import { STORAGE_KEYS } from '../../constants';
import { clearUser } from '../../store/authSlice';
import { storageHelper } from '../../utils/storageHelper';
import { BeneficiaryMobile, BeneficiaryRegistrationPayload, LoginPayload, User } from './auth.type';


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    loginEmployee: builder.mutation<User, LoginPayload>({
      query: (body) => ({
        url: ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body,
      }),
    }),

    logout: builder.mutation<void, void | string>({
      query: (employeeId) => ({
        url: ENDPOINTS.AUTH.LOGOUT,
        method: 'POST',
        headers: employeeId != null ? { employeeId: String(employeeId) } : undefined
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        await storageHelper.remove(STORAGE_KEYS.USER_DATA);
        dispatch(clearUser());
      },
    }),

    checkEmployeeId: builder.query<boolean, { employeeId: string }>({
      query: ({ employeeId }) => ({
        url: ENDPOINTS.AUTH.CHECK_EMPLOYEE_ID,
        method: 'GET',
        params: { employeeId },
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: any) =>
        response?.response?.isPresentInDB ?? false,
    }),

    sendOtp: builder.mutation<void, { employeeId: string }>({
      query: ({ employeeId }) => ({
        url: ENDPOINTS.AUTH.SEND_OTP,
        method: 'POST',
        params: {
          employeeId,
          otpPurpose: "CHANGE_PASSWORD"
        },
      }),
    }),

    verifyOtp: builder.mutation<boolean, { employeeId: string; otp: string }>({
      query: ({ employeeId, otp }) => ({
        url: ENDPOINTS.AUTH.VERIFY_OTP,
        method: 'POST',
        params: {
          employeeId,
          otp,
          otpPurpose: 'CHANGE_PASSWORD',
        },
      }),
      transformResponse: (response: { status?: number }) => response?.status !== 2,
    }),
    resetPassword: builder.mutation<void, { employeeId: string; newPassword: string }>({
      query: (params) => ({
        url: ENDPOINTS.AUTH.RESET_PASSWORD,
        method: 'POST',
        params,
      }),
    }),
    checkBeneficiaryMobile: builder.query<ApiResponse<BeneficiaryMobile>, { mobileNumber: string }>({
      query: ({ mobileNumber }) => ({
        url: ENDPOINTS.AUTH.CHECK_BENEFICIARY_MOBILE,
        method: 'GET',
        params: {
          mobile: mobileNumber,
        },
      }),
      keepUnusedDataFor: 0,
    }),
    registerBeneficiary: builder.mutation<ApiResponse<ApiResponse>, BeneficiaryRegistrationPayload>({
      query: payload => ({
        url: ENDPOINTS.AUTH.SIGN_UP,
        method: 'POST',
        body: payload,
      }),
    }),

  }),
});

export const {
  useLoginEmployeeMutation,
  useLogoutMutation,
  useCheckEmployeeIdQuery,
  useLazyCheckEmployeeIdQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useLazyCheckBeneficiaryMobileQuery,
  useRegisterBeneficiaryMutation
} = authApi;
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/authentication/validatelogin',
    LOGOUT: '/authentication/logout',
    CHECK_BENEFICIARY_MOBILE: '/authentication/beneficiaries/mobile',
    SIGN_UP: "/authentication/signup",

    CHECK_EMPLOYEE_ID: '/authentication/employees/uniquecheck',
    SEND_OTP: '/authentication/generateotp',
    VERIFY_OTP: '/authentication/otp/validate',
    RESET_PASSWORD: '/authentication/newpassword'
  },
  PAYMENTS: {
    PAYU_INITIATE: "/api/v1/payu/initiate",
    PAYU_HASH: "/mobile/api/v1/payu/hash"
  },
  PROJECTS: {
    BENEFICIARY_DETAILS: '/api/v1/hdb/beneficiaries',
    BENEFICIARY_INSTALLMENTS: '/api/v1/hdb/bene/instalment',

  }

} as const;
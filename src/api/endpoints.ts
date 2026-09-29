export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/authentication/validatelogin/new',
    LOGOUT: '/authentication/logout',
    REFRESH:'/authentication/refresh'
  },

  USERS: {
    LIST: '/users',
    PROFILE: '/users/profile'
  },
  EMPLOYEES :{
    LIST :"/api/v1/admin/patient"
  }
} as const;
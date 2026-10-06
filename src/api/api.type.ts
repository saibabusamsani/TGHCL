export interface ApiResponse<T = undefined> {
  status: number;
  message: string;
  response?: T;
}

export interface ApiDataResponse<T> {
  status: number;
  message: string;
  response: {
    data: T;
  };
}
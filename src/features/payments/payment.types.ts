export type InitiatePaymentRequest = {
  amount: number;
  applicationNo: string;
  email: string | null;
};

export type InitiatePaymentData = {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  environment:string,
  surl: string;
  furl: string;
  udf1: string;
  udf2: string;
  udf3: string;
  udf4: string;
  udf5: string;
  hash: string;
  paymentUrl?: string;
};

export type PayUHashEvent = {
  hashName: string;
  hashString: string;
  hashType?: string;
  postSalt?: string;
};

export type PayUErrorEvent = {
  errorCode: string;
  errorMsg: string;
};
import { useCallback, useEffect, useRef, useState } from 'react';
import { NativeEventEmitter } from 'react-native';
import PayUBizSdk from 'payu-non-seam-less-react';
import Toast from 'react-native-toast-message';

import { BASE_URL } from '../../../constants';
import { ENDPOINTS } from '../../../api/endpoints';
import { useInitiatePaymentMutation } from '../payment.api';
import {InitiatePaymentData,InitiatePaymentRequest,PayUErrorEvent,PayUHashEvent} from '../payment.types';

type PaymentResult = 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'ERROR';

type Options = {
  onComplete?: (result: PaymentResult, txnId: string) => void;
};

const MERCHANT_NAME = 'Telangana Housing Board';

const buildCheckoutConfig = (txn: InitiatePaymentData) => ({
  payUPaymentParams: {
    key: txn.key,
    transactionId: txn.txnid,
    amount: txn.amount,
    productInfo: txn.productinfo,
    firstName: txn.firstname,
    email: txn.email ?? '',
    phone: txn.phone,
    ios_surl: txn.surl,
    ios_furl: txn.furl,
    android_surl: txn.surl,
    android_furl: txn.furl,
    environment: txn.environment,
    userCredential: `${txn.key}:${txn.phone}`,
    additionalParam: {
      udf1: txn.udf1 ?? '',
      udf2: txn.udf2 ?? '',
      udf3: txn.udf3 ?? '',
      udf4: txn.udf4 ?? '',
      udf5: txn.udf5 ?? '',
    },
  },

  payUCheckoutProConfig: {
    merchantName: MERCHANT_NAME,
    showExitConfirmationOnCheckoutScreen: true,
    showExitConfirmationOnPaymentScreen: true,
    autoApprove: false,
  },
});

export const usePayUCheckout = ({ onComplete }: Options = {}) => {
  const [initiatePayment] = useInitiatePaymentMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  const txnRef = useRef<InitiatePaymentData | null>(null);
  const busyRef = useRef(false);

  const finish = useCallback(
    (result: PaymentResult) => {
      const txnId = txnRef.current?.txnid;

      if (!txnId) return;

      busyRef.current = false;
      setIsProcessing(false);

      onComplete?.(result, txnId);
    },
    [onComplete],
  );

  const handleGenerateHash = useCallback(async (event: unknown) => {
    const { hashName, hashString, hashType, postSalt } = event as PayUHashEvent;
    const txn = txnRef.current;
    let hash = '';

    if (txn) {
      try {
        const response = await PayUBizSdk.makeHttpRequest(
          BASE_URL + ENDPOINTS.PAYMENTS.PAYU_HASH,
          'POST',
          JSON.stringify({ txnId: txn.txnid, hashName, hashString, hashType, postSalt }),
          { 'Content-Type': 'application/json', Accept: 'application/json' },
        );

        console.log('hashName:', hashName, '--->', response);

        const parsed = typeof response === 'string' ? JSON.parse(response) : response;

        hash = parsed?.response?.hash ?? parsed?.hash ?? '';
      } catch (error) {
        console.log(hashName, '-->', error);
      }
    }

    PayUBizSdk.hashGenerated({[hashName]: hash});
  }, []);

  useEffect(() => {
    const emitter = new NativeEventEmitter(PayUBizSdk);

    const subscriptions = [
      emitter.addListener('generateHash', handleGenerateHash),

      emitter.addListener('onPaymentSuccess', () => {
        Toast.show({
          type: 'success',
          text1: 'Payment successful',
        });

        finish('SUCCESS');
      }),

      emitter.addListener('onPaymentFailure', () => {
        Toast.show({
          type: 'error',
          text1: 'Payment failed',
          text2: 'Please try again.',
        });

        finish('FAILED');
      }),

      emitter.addListener('onPaymentCancel', () => {
        Toast.show({
          type: 'info',
          text1: 'Payment cancelled',
        });

        finish('CANCELLED');
      }),

      emitter.addListener('onError', event => {

        const error = event as PayUErrorEvent;
        console.log("PAYU ERROR :",event)
        Toast.show({
          type: 'error',
          text1: `Payment Error (${error.errorCode})`,
          text2: error.errorMsg,
        });

        finish('ERROR');
      }),
    ];

    return () => subscriptions.forEach(subscription => subscription.remove());
  }, [handleGenerateHash, finish]);

  const startPayment = useCallback(
    async (request: InitiatePaymentRequest) => {
      if (busyRef.current) return;

      busyRef.current = true;
      setIsProcessing(true);

      try {
        const txn = await initiatePayment(request).unwrap();

        if (!txn) {
          throw new Error('Empty initiate response');
        }

        txnRef.current = txn;

        PayUBizSdk.openCheckoutScreen(
          buildCheckoutConfig(txn),
        );
      } catch {
        Toast.show({
          type: 'error',
          text1: 'Could not start payment',
          text2: 'Please try again.',
        });

        busyRef.current = false;
        setIsProcessing(false);
      }
    },
    [initiatePayment],
  );

  return {
    startPayment,
    isProcessing,
  };
};


export type NotificationData =
  | {
      type: 'BILL_APPROVED' | 'BILL_REJECTED';
      billId: string;
    }
  | {
      type: 'PROJECT_UPDATED';
      projectId: string;
    };
export interface RefundItem {
  refundNo: string;
  receiverName: string;
  orderNo: string;
  total: number;
  reason: string;
  requestedAt: string;
  status: string; // เช่น 'PENDING', 'APPROVED', 'REJECTED'
}

export interface RefundsResponse {
  refunds: RefundItem[];
  pendingCount: number;
  page: number;
  size: number;
  total: number;
}

export type ModalType = "PENDING" | "APPROVED" | "REJECTED" | null;

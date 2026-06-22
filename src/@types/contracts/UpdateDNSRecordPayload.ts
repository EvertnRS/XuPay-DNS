import { PayloadBase } from "./PayloadBase";

export type UpdateDNSRecordPayload = PayloadBase & {
  kind: "UPDATE_DNS_RECORD_PAYLOAD";
  id: string;
  ip?: string;
  domain?: string;
  
};
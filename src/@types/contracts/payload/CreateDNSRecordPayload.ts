import { PayloadBase } from "../PayloadBase";

export type CreateDNSRecordPayload = PayloadBase & {
  kind: "CREATE_DNS_RECORD_PAYLOAD";
  domain: string;
  ip: string;
  port: string;
};
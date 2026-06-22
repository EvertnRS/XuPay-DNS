import { PayloadBase } from "../PayloadBase";

export type GetDNSRecordPayload = PayloadBase & {
    kind: "GET_DNS_RECORD_PAYLOAD";
    domain: string;
}
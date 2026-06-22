import { PayloadBase } from "./PayloadBase";

export type DeleteDNSRecordPayload = PayloadBase & {
    kind: "DELETE_DNS_RECORD_PAYLOAD";
    id: string;
}
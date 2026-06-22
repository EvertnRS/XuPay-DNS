import { GetDNSRecordPayload } from "./GetDNSRecordPayload";
import { CreateDNSRecordPayload } from "./CreateDNSRecordPayload";
import { UpdateDNSRecordPayload } from "./UpdateDNSRecordPayload";
import { DeleteDNSRecordPayload } from "./DeleteDNSRecordPayload";

export type Payload =
| UpdateDNSRecordPayload
| DeleteDNSRecordPayload
| CreateDNSRecordPayload
| GetDNSRecordPayload;

export type MessageBody = {
    source: string;
    type: string;
    payload: Payload;
    timestamp: string;
};
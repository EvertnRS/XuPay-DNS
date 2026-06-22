import { GetDNSRecordPayload } from "./payload/GetDNSRecordPayload";
import { CreateDNSRecordPayload } from "./payload/CreateDNSRecordPayload";
import { UpdateDNSRecordPayload } from "./payload/UpdateDNSRecordPayload";
import { DeleteDNSRecordPayload } from "./payload/DeleteDNSRecordPayload";

export type Payload =
| UpdateDNSRecordPayload
| DeleteDNSRecordPayload
| CreateDNSRecordPayload
| GetDNSRecordPayload;

export type MessageBody = { 
    payload: Payload;
};
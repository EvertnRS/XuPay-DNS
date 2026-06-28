import { isValidRequest } from "@/@types/contracts/Request";
import * as dgram from 'dgram'
import { DNSService } from "../service/DNSService";
import { Request } from "@/@types/contracts/Request";
import { GetDNSRecordPayload } from "@/@types/contracts/payload/GetDNSRecordPayload";
import { CreateDNSRecordPayload } from "@/@types/contracts/payload/CreateDNSRecordPayload";
import { UpdateDNSRecordPayload } from "@/@types/contracts/payload/UpdateDNSRecordPayload";
import { DeleteDNSRecordPayload } from "@/@types/contracts/payload/DeleteDNSRecordPayload";

export class DNSController {
    constructor(
        private dnsService: DNSService
    ) {}

    public createDNS(request: Request, socket: dgram.Socket, rinfo: dgram.RemoteInfo): void {
        const validRequest = isValidRequest(request, socket, rinfo);

        if (!validRequest){
            return;
        }

        const payload = request.body.payload as CreateDNSRecordPayload;

        const { ip, domain } = payload;

        this.dnsService.createDNS(ip, domain, socket, rinfo);
    }

    public updateDNS(request: Request, socket: dgram.Socket, rinfo: dgram.RemoteInfo): void {
        const validRequest = isValidRequest(request, socket, rinfo);

        if (!validRequest){
            return;
        }

        const payload = request.body.payload as UpdateDNSRecordPayload;

        const { id, ip, domain } = payload;

        this.dnsService.updateDNS(
            id,
            ip,
            domain,
            socket,
            rinfo
        );
    }
    
    public deleteDNS(request: Request, socket: dgram.Socket, rinfo: dgram.RemoteInfo): void {
        const validRequest = isValidRequest(request, socket, rinfo);

        if (!validRequest){
            return;
        }

        const payload = request.body.payload as DeleteDNSRecordPayload;

        const { id } = payload;

        this.dnsService.deleteDNS(id, socket, rinfo);
    }

    public resolve(request: Request, socket: dgram.Socket, rinfo: dgram.RemoteInfo): void {
        const validRequest = isValidRequest(request, socket, rinfo);

        if (!validRequest){
            return;
        }

        const payload = request.body.payload as GetDNSRecordPayload;

        const { domain } = payload;

        this.dnsService.getHost(domain, socket, rinfo);
    }
}
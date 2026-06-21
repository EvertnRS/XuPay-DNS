import { isValidBodyRequest } from "@/@types/contracts/Request";
import * as dgram from 'dgram'
import { DNSService } from "../service/DNSService";
import { Request } from "@/@types/contracts/Request";
import { ErrorHandler } from "@/infra/middleware/Error";

export class DNSController {
    constructor(
        private dnsService = new DNSService()
    ) {}
    
    public resolve(request: Request, server: dgram.Socket, rinfo: dgram.RemoteInfo): string | void  {
        const messageBody = isValidBodyRequest(request.body, server, rinfo);

        if (!messageBody) {
            return ErrorHandler.handle("Formato de corpo inválido", server, rinfo);
        }

        this.dnsService.getHost(messageBody.payload.instanceName, server, rinfo);
    }
}
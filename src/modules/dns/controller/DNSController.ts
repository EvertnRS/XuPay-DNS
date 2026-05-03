import { isValidBodyRequest } from "@/@types/contracts/Request";
import { Socket } from "net";
import { DNSService } from "../service/DNSService";
import { Request } from "@/@types/contracts/Request";
import { ErrorHandler } from "@/infra/middleware/Error";

export class DNSController {
    constructor(
        private dnsService = new DNSService()
    ) {}
    
    public resolve(request:Request, socket:Socket): string | void  {
        const messageBody = isValidBodyRequest(request.body, socket);

        if (!messageBody) {
            return ErrorHandler.handle("Formato de corpo inválido", socket);
        }

        this.dnsService.getHost(messageBody.payload.instanceName, socket);
    }
}
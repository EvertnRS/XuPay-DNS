import * as dgram from 'dgram';
import { DNSController } from '@/modules/dns/controller/DNSController';
import { DNSService } from '@/modules/dns/service/DNSService';
import { Request } from '@/@types/contracts/Request';
import { ErrorHandler } from '@/infra/middleware/Error';

export class Routes {
    constructor(
        private dnsService = new DNSService(),
        private dnsController = new DNSController(this.dnsService)
    ) {}

    public handle(request:Request, server: dgram.Socket, rinfo: dgram.RemoteInfo) : void  {

        if (request.method === 'GET' && request.path === 'resolve' && request.body.type === 'REQUEST') {
            this.dnsController.resolve(request, server, rinfo);

        } else {
            return ErrorHandler.handle("Rota não encontrada", server, rinfo);
        }
        
    }
}
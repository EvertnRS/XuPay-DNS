import * as dgram from 'dgram';
import { DNSController } from '@/modules/dns/controller/DNSController';
import { DNSService } from '@/modules/dns/service/DNSService';
import { Request } from '@/@types/contracts/Request';
import { ErrorHandler } from '@/infra/middleware/Error';
import { DNSRepositoryImpl } from '@/modules/dns/domain/repository/DNSRepositoryImpl';

export class Routes {
    private readonly dnsRepository: DNSRepositoryImpl;
    private readonly dnsService: DNSService;
    private readonly dnsController: DNSController;


    constructor() {
        this.dnsRepository = new DNSRepositoryImpl();
        this.dnsService = new DNSService(this.dnsRepository);
        this.dnsController = new DNSController(this.dnsService);
    }

    public handle(request: Request, socket: dgram.Socket, rinfo: dgram.RemoteInfo): void {
        if (request.path === "create" && request.method === "POST") {
            this.dnsController.createDNS(request, socket, rinfo);
        }
        else if (request.path === "update" && request.method === "PUT") {
            this.dnsController.updateDNS(request, socket, rinfo);
        }
        else if (request.path === "delete" && request.method === "DELETE") {
            this.dnsController.deleteDNS(request, socket, rinfo);
        }
        else if (request.path === "dns" && request.method === "GET") {
            this.dnsController.getDNS(request, socket, rinfo);
        }
        else {
            return ErrorHandler.handle('Rota não encontrada', socket, rinfo);
        }
        
    }
}
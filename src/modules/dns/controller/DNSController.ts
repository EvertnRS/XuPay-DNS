import { isValidBodyRequest } from "@/@types/contracts/Request";
import * as dgram from 'dgram'
import { DNSService } from "../service/DNSService";
import { Request } from "@/@types/contracts/Request";
import { ErrorHandler } from "@/infra/middleware/Error";

export class DNSController {
    constructor(
        private dnsService: DNSService
    ) {}
    
    public getHost(request: Request, server: dgram.Socket, rinfo: dgram.RemoteInfo): string | void  {
        const messageBody = isValidBodyRequest(request.body, server, rinfo);

        if (!messageBody) {
            return ErrorHandler.handle("Formato de corpo inválido", server, rinfo);
        }

        this.dnsService.getHost(messageBody.payload.kind, server, rinfo);
    }

    public createDNS(request: Request, socket: dgram.Socket, rinfo: dgram.RemoteInfo): void {
        const messageBody = isValidBodyRequest(request.body, socket, rinfo);

        if (!messageBody){
            return ErrorHandler.handle('Corpo da requisição inválido', socket, rinfo);
        }

        if(messageBody.payload.kind !== "CREATE_DNS_RECORD_PAYLOAD"){
            return ErrorHandler.handle('Payload inválido para criação de registro DNS', socket, rinfo);
        }

        this.dnsService.createDNS(messageBody.payload.ip, messageBody.payload.domain, socket, rinfo);
    }

    public updateDNS(request: Request, socket: dgram.Socket, rinfo: dgram.RemoteInfo): void {
        const messageBody = isValidBodyRequest(request.body, socket, rinfo);

        if (!messageBody){
            return ErrorHandler.handle('Corpo da requisição inválido', socket, rinfo);
        }

        if(messageBody.payload.kind !== "UPDATE_DNS_RECORD_PAYLOAD"){
            return ErrorHandler.handle('Payload inválido para atualização de registro DNS', socket, rinfo);
        }

        this.dnsService.updateDNS(
            messageBody.payload.id,
            messageBody.payload.ip,
            messageBody.payload.domain,
            socket,
            rinfo
        );
    }
    
    public deleteDNS(request: Request, socket: dgram.Socket, rinfo: dgram.RemoteInfo): void {
        const messageBody = isValidBodyRequest(request.body, socket, rinfo);

        if (!messageBody){
            return ErrorHandler.handle('Corpo da requisição inválido', socket, rinfo);
        }

        if(messageBody.payload.kind !== "DELETE_DNS_RECORD_PAYLOAD"){
            return ErrorHandler.handle('Payload inválido para exclusão de registro DNS', socket, rinfo);
        }

        this.dnsService.deleteDNS(messageBody.payload.id, socket, rinfo);
    }

    public getDNS(request: Request, socket: dgram.Socket, rinfo: dgram.RemoteInfo): void {
        const messageBody = isValidBodyRequest(request.body, socket, rinfo);

        if (!messageBody){
            return ErrorHandler.handle('Corpo da requisição inválido', socket, rinfo);
        }

        if(messageBody.payload.kind !== "GET_DNS_RECORD_PAYLOAD"){
            return ErrorHandler.handle('Payload inválido para obtenção de registro DNS', socket, rinfo);
        }

        this.dnsService.getDNS(messageBody.payload.id, socket, rinfo);
    }
}
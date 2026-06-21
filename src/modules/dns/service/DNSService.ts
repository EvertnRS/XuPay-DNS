import * as dgram from "dgram";
import { ErrorHandler } from "@/infra/middleware/Error";
import { ResponseParser } from "@/infra/parser/ResponseParser";

export class DNSService {
    private mapping: Record<string, string> = {
        "payment-service-1": process.env["PAYMENT-HOST-1"] || "",
        "payment-service-2": process.env["PAYMENT-HOST-2"] || "",
        "payment-service-3": process.env["PAYMENT-HOST-3"] || "",
        "history-service-1": process.env["HISTORY-HOST-1"] || "",
        "history-service-2": process.env["HISTORY-HOST-2"] || "",
        "history-service-3": process.env["HISTORY-HOST-3"] || "",
        "processing-service-1": process.env["PROCESSING-HOST-1"] || "",
        "processing-service-2": process.env["PROCESSING-HOST-2"] || "",
        "processing-service-3": process.env["PROCESSING-HOST-3"] || ""
    };
        
    public getHost(instanceName: string, server: dgram.Socket, rinfo: dgram.RemoteInfo): string | void {
        const host = this.mapping[instanceName];

        if (!host) {
            return ErrorHandler.handle('Nome da instância: ' + instanceName + ' não encontrado', server, rinfo);
        }

        const response = ResponseParser.serialize({
            method: 'GET',
            path:'resolve',
            body: {
                source: 'DNS_SERVICE',
                type: 'RESPONSE',
                payload:{
                    instanceName: instanceName,
                    host: host
                },
                timestamp: new Date().toISOString()
            }
        });
        server.send(Buffer.from(response), rinfo.port, rinfo.address);
    }
}
  
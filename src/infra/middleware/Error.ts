import * as dgram from "dgram";

export class ErrorHandler {
    
    public static handle(err: String, server: dgram.Socket, rinfo: dgram.RemoteInfo): void {
        const errorMessage = `Error: ${err}`;
        server.send(Buffer.from(errorMessage), rinfo.port, rinfo.address)
        return;
    }
}
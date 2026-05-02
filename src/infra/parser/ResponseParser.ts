import { Response } from "@/@types/contracts/Response";
import { Request } from "@/@types/contracts/Request";
import { Socket } from "net";
import { ErrorHandler } from "../middleware/Error";

export class ResponseParser {
    public static deserialize(request: string, socket:Socket): Request | void {
        const parts = request.split('|');
        const bodyParts = parts[2].split(';');
        const instanceName = bodyParts[2].split('=')[1];
        
        try {
            if (parts.length != 3) {
                return ErrorHandler.handle('Requisição com campos diferentes do esperado '+ request, socket);
            }

            if (bodyParts.length != 4) {
                console.log(bodyParts);
                return ErrorHandler.handle('Corpo da requisição com campos diferentes do esperado ' + request, socket);
            }

            if (instanceName == undefined) {
                return ErrorHandler.handle('Formato do Payload da requisição inválido ' + request, socket);
            }
            
        } catch (error: any) {
            ErrorHandler.handle(`Formato inválido de corpo `  + request, socket);
        }
        
        const [method, path] = parts;
        const [source, type, payload, timestamp] = bodyParts;

        return {
                method,
                path,
                body:{
                    source,
                    type,
                    payload:{
                        instanceName: instanceName
                    },
                    timestamp
                }
            };
    }   

    public static serialize(response: Response): string {
        return `${response.id}|${response.type}|${response.payload}`;
    }
}

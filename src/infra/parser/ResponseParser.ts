import { Response } from "@/@types/contracts/Response";
import { Request } from "@/@types/contracts/Request";
import { Payload } from "@/@types/contracts/MessageBody";
import { GetDNSRecordPayload } from "@/@types/contracts/GetDNSRecordPayload";
import { CreateDNSRecordPayload } from "@/@types/contracts/CreateDNSRecordPayload";
import { UpdateDNSRecordPayload } from "@/@types/contracts/UpdateDNSRecordPayload";
import { DeleteDNSRecordPayload } from "@/@types/contracts/DeleteDNSRecordPayload";

export class ResponseParser {
  public static deserialize(rawRequest: string): Request {
    try {
      const request = rawRequest.trim();

      const parts = request.split("|");

      if (parts.length !== 3) {
        throw new Error(
          "Requisição com campos diferentes do esperado " + request
        );
      }

      const [method, path, rawBody] = parts;

      const bodyParts = rawBody.split(";").map((part) => part.trim());

      if (bodyParts.length !== 4) {
        throw new Error(
          "Corpo da requisição com campos diferentes do esperado " + rawBody
        );
      }

      const [source, type, rawPayload, timestamp] = bodyParts;

      const payload = this.parsePayload(rawPayload);

      return {
        method,
        path,
        body: {
          source,
          type,
          payload,
          timestamp: timestamp.trim(),
        },
      };
    } catch (error: any) {
      throw new Error(`Formato inválido de corpo: ${error.message}`);
    }
  }

  private static parsePayload(rawPayload: string): Payload {
    const payload = this.parseKeyValueList(rawPayload);

    const hasId = payload.id !== undefined;
    const hasIp = payload.ip !== undefined;
    const hasDomain = payload.domain !== undefined;
    const hasDelete = payload.delete === "true";

    const hasAnyUpdateField =
      hasIp || hasDomain;

    if (
      !hasId &&
      hasIp &&
      hasDomain &&
      !hasDelete
    ) {
      return this.parseCreatePayload(payload);
    }

    if (hasId && !hasAnyUpdateField && !hasDelete) {
      return this.parseGetPayload(payload);
    }

    if (hasId && hasAnyUpdateField && !hasDelete) {
      return this.parseUpdatePayload(payload);
    }

    if (hasId && !hasAnyUpdateField && hasDelete) {
      return this.parseDeletePayload(payload);
    }

    throw new Error(
      "Payload do Customer inválido. Formatos aceitos: id=xxx | ip=xxx,domain=xxx | id=xxx,ip=xxx | id=xxx,domain=xxx | id=xxx,delete=true"
    );
  }

  private static parseGetPayload(
    payload: Record<string, string>
  ): GetDNSRecordPayload {
    return {
      kind: "GET_DNS_RECORD_PAYLOAD",
      id: payload.id,
    };
  }

  private static parseCreatePayload(
    payload: Record<string, string>
  ): CreateDNSRecordPayload {
    return {
      kind: "CREATE_DNS_RECORD_PAYLOAD",
      ip: payload.ip,
      domain: payload.domain,
    };
  }

  private static parseUpdatePayload(
    payload: Record<string, string>
  ): UpdateDNSRecordPayload {
    const parsedPayload: UpdateDNSRecordPayload = {
      kind: "UPDATE_DNS_RECORD_PAYLOAD",
      id: payload.id,
    };

    if (payload.ip !== undefined) {
      parsedPayload.ip = payload.ip;
    }

    if (payload.domain !== undefined) {
      parsedPayload.domain = payload.domain;
    }

    return parsedPayload;
  }

  private static parseDeletePayload(
    payload: Record<string, string>
  ): DeleteDNSRecordPayload {
    return {
      kind: "DELETE_DNS_RECORD_PAYLOAD",
      id: payload.id,
    };
  }

  private static parseKeyValueList(rawPayload: string): Record<string, string> {
    if (!rawPayload || rawPayload.trim() === "") {
      throw new Error("Payload vazio");
    }

    const payload: Record<string, string> = {};

    const fields = rawPayload.split(",");

    for (const field of fields) {
      const separatorIndex = field.indexOf("=");

      if (separatorIndex === -1) {
        throw new Error(`Campo de payload sem "=": ${field}`);
      }

      const key = field.slice(0, separatorIndex).trim();
      const value = field.slice(separatorIndex + 1).trim();

      if (!key || !value) {
        throw new Error(`Campo de payload inválido: ${field}`);
      }

      payload[key] = value;
    }

    return payload;
  }

  public static serialize(response: Response): string {
    return `${response.method}|${response.path}|${response.body.source};${response.body.type};${response.body.payload};${response.body.timestamp}`;
  }
}
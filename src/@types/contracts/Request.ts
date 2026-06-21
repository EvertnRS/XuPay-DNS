import { MessageBody } from "./MessageBody";
import * as dgram from "dgram";
import { ErrorHandler } from "../../infra/middleware/Error";

export type Request = {
  method: string;
  path: string;
  body: MessageBody;
};

enum Source {
  LOAD_BALANCE = "LOAD_BALANCE"
}

enum Type {
  RESPONSE = "RESPONSE",
  REQUEST = "REQUEST"
}

export function isValidBodyRequest(
  messageBody: MessageBody,
  server: dgram.Socket,
  rinfo: dgram.RemoteInfo
): MessageBody | void {
  if (!Object.values(Source).includes(messageBody.source as Source)) {
      return  ErrorHandler.handle("Origem inválida: " + messageBody.source, server, rinfo);
    }

    if (!Object.values(Type).includes(messageBody.type as Type)) {
      return ErrorHandler.handle("Tipo inválido: " + messageBody.type, server, rinfo);
    }

    if (
      messageBody.timestamp &&
      !isValidIsoTimestampWithMilliseconds(messageBody.timestamp)
    ) {
      return ErrorHandler.handle("Timestamp inválido: " + messageBody.timestamp, server, rinfo);
    }

    return messageBody;
  }
function isValidIsoTimestampWithMilliseconds(timestamp: string): boolean {
  const ISO_WITH_MILLISECONDS_REGEX =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  if (!ISO_WITH_MILLISECONDS_REGEX.test(timestamp)) {
    return false;
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.toISOString() === timestamp;
}
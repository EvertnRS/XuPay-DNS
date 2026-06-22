import * as dgram from "dgram";
import { ErrorHandler } from "@/infra/middleware/Error";
import { ResponseParser } from "@/infra/parser/ResponseParser";
import { IDNSRepository } from "../domain/repository/IDNSRepository";

export class DNSService {
  constructor(private readonly dnsRepository: IDNSRepository) {}

  public async getHost(domain: string, server: dgram.Socket, rinfo: dgram.RemoteInfo): Promise<void> {
    const record = await this.dnsRepository.findByDomain(domain);

    if (!record) {
      return ErrorHandler.handle(
        `Domínio ${domain} não encontrado`,
        server,
        rinfo,
      );
    }

    const payload = `id=${record.id},ip=${record.ip},domain=${record.domain},createdAt=${record.createdAt.toISOString()}`;

    const response = ResponseParser.serialize({
      method: "GET",
      path: "resolve",
      body: {
        source: "DNS_SERVICE",
        type: "RESPONSE",
        payload,
        timestamp: new Date().toISOString(),
      },
    });

    server.send(Buffer.from(response), rinfo.port, rinfo.address);
  }

  public async createDNS(ip: string, domain: string, server: dgram.Socket, rinfo: dgram.RemoteInfo, ): Promise<void> {
    if (!ip || !domain) {
      return ErrorHandler.handle(
        "Dados incompletos para criação do cliente",
        server,
        rinfo,
      );
    }
    const existingRecord = await this.dnsRepository.findByDomain(domain);

    if (existingRecord) {
      return ErrorHandler.handle(
        "Registro DNS com este domínio já existe",
        server,
        rinfo,
      );
    }
    const record = await this.dnsRepository.create({ ip, domain });

    const payload =
      "id=" +
      record.id +
      ",ip=" +
      record.ip +
      ",domain=" +
      record.domain +
      ",createdAt=" +
      record.createdAt.toISOString();

    const response = ResponseParser.serialize({
      method: "POST",
      path: "dns-create",
      body: {
        source: "SERVICE",
        type: "RESPONSE",
        payload: payload,
        timestamp: new Date().toISOString(),
      },
    });

    server.send(Buffer.from(response), rinfo.port, rinfo.address);
  }

  public async updateDNS(id: string, ip: string | undefined, domain: string | undefined, server: dgram.Socket, rinfo: dgram.RemoteInfo, ): Promise<void> {
    if (!id) {
      return ErrorHandler.handle(
        "ID do registro DNS é obrigatório para atualização",
        server,
        rinfo,
      );
    }

    const existingRecord = await this.dnsRepository.findById(id);

    if (!existingRecord) {
      return ErrorHandler.handle(
        "Registro DNS com este ID não encontrado",
        server,
        rinfo,
      );
    }

    const dataToUpdate: {
      ip?: string;
      domain?: string;
    } = {};

    if (ip !== undefined) {
      if (ip.trim() === "") {
        return ErrorHandler.handle("IP não pode ser vazio", server, rinfo);
      }

      dataToUpdate.ip = ip;
    }

    if (domain !== undefined) {
      if (domain.trim() === "") {
        return ErrorHandler.handle("Domínio não pode ser vazio", server, rinfo);
      }

      dataToUpdate.domain = domain;
    }

    if (domain !== undefined) {
      if (domain.trim() === "") {
        return ErrorHandler.handle("Domínio não pode ser vazio", server, rinfo);
      }

      const dnsWithSameDomain = await this.dnsRepository.findByDomain(domain);

      if (dnsWithSameDomain && dnsWithSameDomain.id !== id) {
        return ErrorHandler.handle(
          "Outro registro DNS com este domínio já existe",
          server,
          rinfo,
        );
      }

      dataToUpdate.domain = domain;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return ErrorHandler.handle(
        "Nenhum campo válido enviado para atualização",
        server,
        rinfo,
      );
    }

    const updatedDNS = await this.dnsRepository.update(id, dataToUpdate);

    const payload =
      "id=" +
      updatedDNS.id +
      ",ip=" +
      updatedDNS.ip +
      ",domain=" +
      updatedDNS.domain +
      ",createdAt=" +
      updatedDNS.createdAt.toISOString();

    const response = ResponseParser.serialize({
      method: "PUT",
      path: "dns-update",
      body: {
        source: "SERVICE",
        type: "RESPONSE",
        payload: payload,
        timestamp: new Date().toISOString(),
      },
    });

    server.send(Buffer.from(response), rinfo.port, rinfo.address);
  }

  public async deleteDNS(id: string, server: dgram.Socket, rinfo: dgram.RemoteInfo, ): Promise<void> {
    if (!id) {
      return ErrorHandler.handle(
        "ID do registro DNS é obrigatório para exclusão",
        server,
        rinfo,
      );
    }

    const existingDNS = await this.dnsRepository.findById(id);

    if (!existingDNS) {
      return ErrorHandler.handle(
        "Registro DNS com este ID não encontrado",
        server,
        rinfo,
      );
    }

    await this.dnsRepository.delete(id);
  }

  public async getDNS(id: string, server: dgram.Socket, rinfo: dgram.RemoteInfo, ): Promise<void> {
    if (!id) {
      return ErrorHandler.handle(
        "ID do registro DNS é obrigatório para consulta",
        server,
        rinfo,
      );
    }

    const dns = await this.dnsRepository.findById(id);

    if (!dns) {
      return ErrorHandler.handle(
        "Registro DNS com este ID não encontrado",
        server,
        rinfo,
      );
    }

    const payload =
      "id=" +
      dns.id +
      ",ip=" +
      dns.ip +
      ",domain=" +
      dns.domain +
      ",createdAt=" +
      dns.createdAt.toISOString();

    const response = ResponseParser.serialize({
      method: "GET",
      path: "dns",
      body: {
        source: "SERVICE",
        type: "RESPONSE",
        payload: payload,
        timestamp: new Date().toISOString(),
      },
    });

    server.send(Buffer.from(response), rinfo.port, rinfo.address);
  }
}

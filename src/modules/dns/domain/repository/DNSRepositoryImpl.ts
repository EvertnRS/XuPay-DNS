import { DNSRecord } from "../entity/DNSRecord";
import { IDNSRepository } from "./IDNSRepository";
import { prismaClient } from "../../../../infra/database/prismaClient";

export class DNSRepositoryImpl implements IDNSRepository {
 
    public async create(record: Omit<DNSRecord, "id" | "createdAt">): Promise<DNSRecord> {
        return await prismaClient.dNSRecord.create({
            data: {
                domain: record.domain,
                ip: record.ip,
                port: record.port,
            }
        });
    }

    public async update(id: string, data: any): Promise<DNSRecord> {
        return await prismaClient.dNSRecord.update({
            where: {
                id: id
            },
            data: data
        });
    }

    public async delete(id: string): Promise<void> {
        await prismaClient.dNSRecord.delete({
            where: {
                id: id
            }
        });
    }

    public async findById(id: string): Promise<DNSRecord | null> {
        return await prismaClient.dNSRecord.findUnique({
            where: {
                id: id
            }
        });
    }

    public async findByDomain(domain: string): Promise<DNSRecord | null> {
        return await prismaClient.dNSRecord.findUnique({
            where: {
                domain: domain
            }
        });
    }

}
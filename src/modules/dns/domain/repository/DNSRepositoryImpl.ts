import { DNSRecord } from "../entity/DNSRecord";
import { IDNSRepository } from "./IDNSRepository";
import { PrismaClient } from "@prisma/client/extension";

export class DNSRepositoryImpl implements IDNSRepository {
 
    public async create(record: Omit<DNSRecord, "id" | "createdAt">): Promise<DNSRecord> {
        const prisma = new PrismaClient();
        const createdRecord = await prisma.dnsRecord.create({
            data: {
                domain: record.domain,
                ip: record.ip
            }
        });
        return createdRecord;
    }

    public async update(id: string, data: any): Promise<DNSRecord> {
        const prisma = new PrismaClient();
        const record = await prisma.dnsRecord.update({
            where: {
                id: id
            },
            data: data
        });
        return record;
    }

    public async delete(id: string): Promise<void> {
        const prisma = new PrismaClient();
        await prisma.dnsRecord.delete({
            where: {
                id: id
            }
        });
    }

    public async findById(id: string): Promise<DNSRecord> {
        const prisma = new PrismaClient();

        const record = await prisma.dnsRecord.findUnique({
            where: {
                id: id
            }
        });

        return record;
    }

    public async findByDomain(domain: string): Promise<DNSRecord> {
        const prisma = new PrismaClient();
        const record = await prisma.dnsRecord.findUnique({
            where: {
                domain: domain
            }
        });
        return record;
    }

}
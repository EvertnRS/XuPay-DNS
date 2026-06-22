import {DNSRecord} from "../entity/DNSRecord";

export interface IDNSRepository {
    findById(id: string): Promise<DNSRecord>;
    findByDomain(domain: string): Promise<DNSRecord>;

    create(record: Omit<DNSRecord, "id" | "createdAt">): Promise<DNSRecord>;
    update(id: string, data: any): Promise<DNSRecord>;
    delete(id: string): Promise<void>;
}

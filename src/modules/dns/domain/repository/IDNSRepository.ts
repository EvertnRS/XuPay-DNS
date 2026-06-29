import {DNSRecord} from "../entity/DNSRecord";

export interface IDNSRepository {
    findById(id: string): Promise<DNSRecord | null>;
    findByDomain(domain: string): Promise<DNSRecord | null>;

    create(record: Omit<DNSRecord, "id" | "createdAt">): Promise<DNSRecord>;
    update(id: string, data: any): Promise<DNSRecord>;
    delete(id: string): Promise<void>;
}

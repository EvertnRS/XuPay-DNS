-- CreateTable
CREATE TABLE "DNSRecord" (
    "id" SERIAL NOT NULL,
    "domain" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DNSRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DNSRecord_domain_key" ON "DNSRecord"("domain");

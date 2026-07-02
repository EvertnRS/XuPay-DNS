/*
  Warnings:

  - Added the required column `port` to the `DNSRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DNSRecord" ADD COLUMN     "port" TEXT NOT NULL;

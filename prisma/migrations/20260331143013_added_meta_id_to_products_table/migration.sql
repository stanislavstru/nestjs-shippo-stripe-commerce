/*
  Warnings:

  - A unique constraint covering the columns `[meta_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "meta_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "products_meta_id_key" ON "products"("meta_id");

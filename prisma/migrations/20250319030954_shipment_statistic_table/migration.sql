-- CreateTable
CREATE TABLE "shipping_calculation" (
    "id" TEXT NOT NULL,
    "cart_items" JSONB NOT NULL,
    "shipment_object" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_calculation_pkey" PRIMARY KEY ("id")
);

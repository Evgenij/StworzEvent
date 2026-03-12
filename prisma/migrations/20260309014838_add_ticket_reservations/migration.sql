-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'CONFIRMED';

-- CreateTable
CREATE TABLE "ticket_reservations" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ticket_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticket_reservation_items" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "ticket_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ticket_reservation_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ticket_reservations" ADD CONSTRAINT "ticket_reservations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_reservation_items" ADD CONSTRAINT "ticket_reservation_items_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "ticket_reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticket_reservation_items" ADD CONSTRAINT "ticket_reservation_items_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

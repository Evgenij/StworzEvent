-- AlterTable
ALTER TABLE "events" ADD COLUMN     "address" TEXT,
ADD COLUMN     "cover_image" TEXT,
ADD COLUMN     "location" TEXT;

-- CreateTable
CREATE TABLE "event_faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "event_faqs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_event_faqs_event_id" ON "event_faqs"("event_id");

-- AddForeignKey
ALTER TABLE "event_faqs" ADD CONSTRAINT "event_faqs_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('TEXT', 'IMAGE', 'FAQ', 'VIDEO', 'SPEAKERS', 'CUSTOM');

-- CreateTable
CREATE TABLE "event_sections" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "type" "SectionType" NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "order" INTEGER NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_agenda_items" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3),
    "location" TEXT,
    "speaker_name" TEXT,
    "order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_agenda_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_event_sections_event_id" ON "event_sections"("event_id");

-- CreateIndex
CREATE INDEX "idx_event_agenda_event_id" ON "event_agenda_items"("event_id");

-- AddForeignKey
ALTER TABLE "event_sections" ADD CONSTRAINT "event_sections_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_agenda_items" ADD CONSTRAINT "event_agenda_items_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

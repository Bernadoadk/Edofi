-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('single', 'recurring');

-- CreateEnum
CREATE TYPE "public"."DurationType" AS ENUM ('days', 'hours');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('EVENT_REMINDER', 'CREATION_DEADLINE', 'MATERIAL_PREPARATION', 'FINALIZATION_REMINDER', 'MODIFICATION_DEADLINE', 'PUBLICATION_REMINDER', 'VERIFICATION_REMINDER', 'CONFIGURATION_REMINDER', 'NEW_BOOKING', 'BOOKING_CANCELLATION', 'CAPACITY_REACHED', 'PAYMENT_RECEIVED', 'PAYMENT_FAILED', 'REFUND_PROCESSED', 'WAITLIST_ACTIVATED', 'BOOKING_CONFIRMATION', 'PARTICIPANT_REMINDER', 'STATUS_CHANGE', 'NEW_TICKET_AVAILABLE', 'TICKET_PROMOTION', 'NEW_PARTICIPANT', 'NEW_COMMENT', 'EVENT_SHARED', 'EVENT_FAVORITED', 'NEW_FOLLOWER', 'COMMENT_MENTION', 'COMMENT_REPLY', 'EVENT_RECOMMENDED', 'NEW_LIKE', 'NEW_RATING', 'EVENT_TRENDING', 'VIEWS_RECORD', 'RECOMMENDATION_ENGINE', 'DAILY_STATS', 'EVENT_VIRAL', 'FOLLOWER_GROWTH', 'EVENT_POPULAR', 'GOAL_ACHIEVED', 'EMAIL_VERIFICATION', 'NEW_LOGIN', 'SECURITY_UPDATE', 'NEW_FEATURE', 'MAINTENANCE_SCHEDULED', 'TECHNICAL_ISSUE', 'SERVICE_PROMOTION', 'NEW_CATEGORY', 'SPECIAL_OFFER', 'PREMIUM_EVENT', 'SEASONAL_DISCOUNT', 'NEW_PRICING', 'LOYALTY_PROGRAM', 'SPONSORED_EVENT', 'NEARBY_EVENTS', 'SIMILAR_EVENTS', 'WEEKEND_EVENTS', 'SEASONAL_EVENTS', 'POPULAR_EVENTS', 'RECOMMENDED_EVENTS', 'EVENT_MODIFIED', 'EVENT_CANCELLED', 'TECHNICAL_PROBLEM', 'EVENT_POSTPONED', 'LOCATION_CHANGE', 'TIME_CHANGE');

-- CreateEnum
CREATE TYPE "public"."NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."NotificationStatus" AS ENUM ('PENDING', 'SENT', 'READ', 'FAILED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "event_type" "public"."EventType" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_date" TIMESTAMP(3),
    "end_time" TEXT NOT NULL,
    "duration_type" "public"."DurationType",
    "duration_value" INTEGER,
    "location_address" TEXT NOT NULL,
    "location_lat" DOUBLE PRECISION NOT NULL,
    "location_lng" DOUBLE PRECISION NOT NULL,
    "banner_image" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tickets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "event_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" "public"."NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "public"."NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "data" JSONB,
    "read_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification_preferences" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "email_enabled" BOOLEAN NOT NULL DEFAULT true,
    "push_enabled" BOOLEAN NOT NULL DEFAULT true,
    "sms_enabled" BOOLEAN NOT NULL DEFAULT false,
    "in_app_enabled" BOOLEAN NOT NULL DEFAULT true,
    "planning_enabled" BOOLEAN NOT NULL DEFAULT true,
    "booking_enabled" BOOLEAN NOT NULL DEFAULT true,
    "social_enabled" BOOLEAN NOT NULL DEFAULT true,
    "performance_enabled" BOOLEAN NOT NULL DEFAULT true,
    "system_enabled" BOOLEAN NOT NULL DEFAULT true,
    "commercial_enabled" BOOLEAN NOT NULL DEFAULT false,
    "personalized_enabled" BOOLEAN NOT NULL DEFAULT true,
    "urgent_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_user_id_key" ON "public"."notification_preferences"("user_id");

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."events" ADD CONSTRAINT "events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tickets" ADD CONSTRAINT "tickets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

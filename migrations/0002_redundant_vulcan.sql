ALTER TABLE "donations" ADD COLUMN "message" text;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "is_anonymous" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "payment_status" text DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "donations" ADD COLUMN "stripe_payment_id" text;
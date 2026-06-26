CREATE TABLE "pastes" (
	"id" text PRIMARY KEY NOT NULL,
	"ciphertext" text NOT NULL,
	"nonce" text NOT NULL,
	"algorithm" text DEFAULT 'AES-256-GCM' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"burn_after_read" boolean DEFAULT false NOT NULL,
	"size_bytes" integer NOT NULL
);

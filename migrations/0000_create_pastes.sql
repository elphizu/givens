CREATE TABLE "pastes" (
	"id" text PRIMARY KEY NOT NULL,
	"ciphertext" text NOT NULL,
	"burn_token" text,
	"burn_key" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);

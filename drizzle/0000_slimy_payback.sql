CREATE TABLE "urls" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "urls_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"long_url" varchar(2048) NOT NULL,
	"short_url" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);

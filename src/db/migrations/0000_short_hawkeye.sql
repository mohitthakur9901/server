CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"recipe_id" integer NOT NULL,
	"title" text NOT NULL,
	"image" text NOT NULL,
	"cooktime" text NOT NULL,
	"servings" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { client } from "./config/db";
import { favoritesTable } from "./db/schema";
import { and, eq } from "drizzle-orm";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.send("Server is healthy");
});


app.get("/api/favorites", async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const favorites = await client
            .select()
            .from(favoritesTable)
            .where(eq(favoritesTable.userId, userId as string));
        return res.status(200).json(favorites);
        
    } catch (error) {
        console.error("Error inserting favorite:", error);
        res.status(500).json({ error: "Internal server error" });
        
    }
    
});

app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cooktime, servings } = req.body;

    if (!userId || !recipeId || !title || !image || !cooktime || !servings) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newfavorite = await client
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cooktime,
        servings,
      })
      .returning();

    return res.status(201).json(newfavorite[0]);
  } catch (error) {
    console.error("Error inserting favorite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/favorites", async (req, res) => {
  const { userId, recipeId } = req.query;

  if (!userId || !recipeId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  await client
    .delete(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, userId as string),
        eq(favoritesTable.recipeId, parseInt(recipeId as string))
      )
    );

  res.status(200).json({ message: "Favorite deleted successfully" });
});


app.listen(ENV.PORT, () => {
  console.log("Server is running on port", `${ENV.PORT}`);
});

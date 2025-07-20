import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { ENV } from "./env";

import * as schema from "../db/schema"

const sql = neon(ENV.DATABASE_URL);
export const client = drizzle(sql, { schema });
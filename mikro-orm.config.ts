import { defineConfig } from "@mikro-orm/mongodb";
import { env } from "./src/lib/env";
import { User } from "./src/lib/db/entities/User";
import { Todo } from "./src/lib/db/entities/Todo";
import { RefreshToken } from "./src/lib/db/entities/RefreshToken";

export default defineConfig({
  clientUrl: env.databaseUrl,
  entities: [User, Todo, RefreshToken],
  debug: env.nodeEnv !== "production"
});

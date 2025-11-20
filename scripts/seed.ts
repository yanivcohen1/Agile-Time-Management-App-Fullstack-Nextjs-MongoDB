import { config as loadEnv } from "dotenv";
import "reflect-metadata";
loadEnv();
loadEnv({ path: ".env.development", override: false });
loadEnv({ path: ".env.local", override: false });
import bcrypt from "bcryptjs";
import { MikroORM } from "@mikro-orm/mongodb";
import config from "../mikro-orm.config";
import { User } from "../src/lib/db/entities/User";
import { Todo } from "../src/lib/db/entities/Todo";
import { RefreshToken } from "../src/lib/db/entities/RefreshToken";
import { TODO_STATUSES } from "../src/types/todo";

const SEED_EMAIL = "demo@todo.dev";
const SEED_NAME = "Demo User";

const demoTodos = [
  {
    title: "Wire up MikroORM + Mongo",
    description: "Ensure database connection + migrations are configured.",
    status: TODO_STATUSES[1],
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    tags: ["infra", "orm"]
  },
  {
    title: "Implement JWT auth",
    description: "Short-lived access tokens paired with refresh rotation.",
    status: TODO_STATUSES[0],
    tags: ["auth"]
  },
  {
    title: "Polish dashboard UI",
    description: "Filters, dialogs, and optimistic interactions.",
    status: TODO_STATUSES[2],
    tags: ["ui"]
  }
];

async function seed() {
  const orm = await MikroORM.init(config);
  const em = orm.em.fork();

  await em.nativeDelete(RefreshToken, {});
  await em.nativeDelete(Todo, {});
  await em.nativeDelete(User, {});

  const password = process.env.SEED_DEMO_PASSWORD ?? "ChangeMe123!";
  const hashedPassword = await bcrypt.hash(password, 10);

  const now = new Date();
  const user = em.create(User, {
    email: SEED_EMAIL,
    name: SEED_NAME,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now
  });
  await em.persistAndFlush(user);

  demoTodos.forEach((todo) => {
    const timestamps = { createdAt: new Date(), updatedAt: new Date() };
    const entity = em.create(Todo, { ...todo, owner: user, ...timestamps });
    em.persist(entity);
  });
  await em.flush();

  await orm.close(true);
  console.log(`Seeded demo account ${SEED_EMAIL} with password ${password}`);
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

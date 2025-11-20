import "reflect-metadata";
import { MikroORM, MongoEntityManager, MongoDriver } from "@mikro-orm/mongodb";
import config from "../../../mikro-orm.config";

const globalForOrm = globalThis as typeof globalThis & {
  orm?: Promise<MikroORM<MongoDriver>>;
};

const getOrmInternal = () => {
  if (!globalForOrm.orm) {
    globalForOrm.orm = MikroORM.init<MongoDriver>(config);
  }
  return globalForOrm.orm;
};

export const getOrm = () => getOrmInternal();

export const getEntityManager = async (): Promise<MongoEntityManager> => {
  const orm = await getOrmInternal();
  return orm.em.fork();
};

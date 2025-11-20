import { Entity, Enum, ManyToOne, PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { TODO_STATUSES, type TodoStatus } from "../../../types/todo";
import { User } from "./User";

@Entity({ collection: "todos" })
export class Todo {
  @PrimaryKey()
  _id: ObjectId = new ObjectId();

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  title!: string;

  @Property({ nullable: true })
  description?: string;

  @Enum({ items: () => TODO_STATUSES, default: "PENDING" })
  status: TodoStatus = "PENDING";

  @Property({ nullable: true })
  dueDate?: Date;

  @Property({ type: "array", default: [] })
  tags: string[] = [];

  @ManyToOne(() => User)
  owner!: User;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
  updatedAt: Date = new Date();
}

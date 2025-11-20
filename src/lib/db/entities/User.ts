import { Entity, PrimaryKey, Property, SerializedPrimaryKey, Unique } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";

@Entity({ collection: "users" })
export class User {
  @PrimaryKey()
  _id: ObjectId = new ObjectId();

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  @Unique()
  email!: string;

  @Property()
  password!: string;

  @Property()
  name!: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), onCreate: () => new Date() })
  updatedAt: Date = new Date();
}

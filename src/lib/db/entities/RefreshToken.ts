import { Entity, ManyToOne, PrimaryKey, Property, SerializedPrimaryKey, Unique } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";
import { User } from "./User";

@Entity({ collection: "refresh_tokens" })
export class RefreshToken {
  @PrimaryKey()
  _id: ObjectId = new ObjectId();

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  @Unique()
  token!: string;

  @ManyToOne(() => User)
  user!: User;

  @Property()
  expiresAt!: Date;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}

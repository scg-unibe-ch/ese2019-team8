import {
  Column,
  Default,
  AllowNull,
  PrimaryKey,
  Model,
  Table,
  BelongsTo,
  AutoIncrement,
  ForeignKey
} from 'sequelize-typescript';
import {User} from './user.model';

@Table
export class Service extends Model<Service> {

  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column
  username!: String;

  @BelongsTo(() => User)
  user!: User;

  @AllowNull(false)
  @Column
  serviceName!: String;

  @Column
  category!: String;

  @Column
  price!: number;

  @Column
  location!: String;

  @Column
  description!: String;

  fromSimplification(simplification: any): void {
    this.username = simplification['username'];
    this.serviceName = simplification['serviceName'];
    this.category = simplification['category'];
    this.price = simplification['price'];
    this.location = simplification['location'];
    this.description = simplification['description'];
  }

  toSimplification(): any {
    return {
      'id': this.id,
      'username': this.username,
      'serviceName': this.serviceName,
      'category': this.category,
      'price': this.price,
      'location': this.location,
      'description': this.description
    };
  }

}

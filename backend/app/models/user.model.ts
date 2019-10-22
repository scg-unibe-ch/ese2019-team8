import {Column, PrimaryKey, Model, Table} from 'sequelize-typescript';

/*
import * as bcrypt from 'bcrypt';
*/

@Table
export class User extends Model<User> {

  @PrimaryKey
  @Column
  username!: String;

  @Column
  passwordHash!: String;

  @Column
  isServiceProvider!: boolean;

  @Column
  email!: string;

  @Column
  address!: string;

  @Column
  zip!: string;

  @Column
  city!: string;

  @Column
  phoneNumber!: string;

  // True if user is approved by admin (todo)
  @Column
  isApproved!: boolean;

  fromSimplification(simplification: any): void {
    this.username = simplification['username'];
    this.isServiceProvider = simplification['isServiceProvider'];
    this.passwordHash = simplification['password'];
    this.email = simplification['email'];
    this.address = simplification['address'];
    this.zip = simplification['zip'];
    this.city = simplification['city'];
    this.phoneNumber = simplification['phoneNumber'];
    this.isApproved = simplification['isApproved'];
  }

  toSimplification(): any {
    return {
      'id': this.id,
      'username': this.username,
      'isServiceProvider': this.isServiceProvider,
      'email': this.email,
      'address': this.address,
      'zip': this.zip,
      'city': this.city,
      'phoneNumber': this.phoneNumber,
      'isApproved': this.isApproved
    };
  }


}

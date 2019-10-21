import {Column, PrimaryKey, Model, Table} from 'sequelize-typescript';

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


  fromSimplification(simplification: any): void {
    this.username = simplification['username'];
    this.isServiceProvider = simplification['isServiceProvider'];
    this.passwordHash = simplification['password'];
    this.email = simplification['email'];
    this.address = simplification['address'];
    this.zip = simplification['zip'];
    this.city = simplification['city'];
    this.phoneNumber = simplification['phoneNumber'];
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
      'phoneNumber': this.phoneNumber
    };
  }


}

export class UserItem {
  userItemsId: number;

  constructor(
    public id: number,
    public username: string,
    public isServiceProvider: boolean,
    public email: string,
    public address: string,
    public zip: number,
    public city: string,
    public phoneNumber: number,
  ) {}


}




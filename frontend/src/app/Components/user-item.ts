export class UserItem {
  userItemsId: number;
  id: number;

  constructor(
    public password: string,
    public username: string,
    public isServiceProvider: boolean,
    public email: string,
    public address: string,
    public zip: number,
    public city: string,
    public phoneNumber: number,
  ) {
  }


}




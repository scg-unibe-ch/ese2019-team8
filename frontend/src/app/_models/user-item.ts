export class UserItem {

  constructor(
    public password: string,
    public username: string,
    public isServiceProvider: boolean = false,
    public email: string = '',
    public address: string = '',
    public zip: number = null,
    public city: string = '',
    public phoneNumber: number = null,
    public isApproved: boolean = false
  ) {
  }


}




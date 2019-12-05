export class ServiceItem {

  constructor(
    public id: number,
    public user: string,
    public serviceName: string,
    public category: string = '',
    public price: number = null,
    public location: string = '',
    public description: string = '',
    public contactMail: string,
  ) {
  }
}

export class ServiceItem {
  serviceItemsId: number;
  id: number;

  constructor(
    public user: string,
    public serviceName: string,
    public category: string,
    public price: number,
    public location: string,
    public description: string,
  ) {
  }


}

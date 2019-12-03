export class ServiceItem {
  serviceItemsId: number;


  constructor(
    public   id: number,
    public user: string,
    public serviceName: string,
    public category: string,
    public price: number,
    public location: string,
    public description: string,
  ) {
  }


}

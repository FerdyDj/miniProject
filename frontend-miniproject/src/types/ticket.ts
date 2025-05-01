export interface IOrderTicket {
  id: string;
  qty: number;
  status: string;
  customerId: number;
  invoiceUrl: string;
  ticket: {
    id: string;
    category: string;
    price: number;
    quantity: number;
    event: {
      id: string;
      title: string;
      image: string;
      eventDate: string;
      category: string;
      description: string;
      location: string;
      startTime: string;
      endTime: string;
      venue: string;
    };
  };
}

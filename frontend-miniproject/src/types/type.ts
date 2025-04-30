export interface IEvent {
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
}

export interface ITicket {
  id: string;
  category: string;
  price: number;
  quantity: string;
  eventId: string;
}

export interface IPoint {
  amount: number;
}

export interface IDiscount {
  id: number;
  code: string;
  percen: number;
}

export interface ICustomer {
  id: number;
}

export interface IOrder {
  id: string;
  ticketId: string;
}
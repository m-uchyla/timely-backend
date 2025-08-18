export type Pagination = {
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  items: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type PanelResponse<T> = {
  data: T;
  pagination: Pagination;
};

export type AppointmentPanelItem = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'archived';
  notes?: string;
  cancellationReason?: string;
  price?: number;
  employee: {
    id: number;
    name: string;
  };
  service: {
    id: number;
    name: string;
    description?: string;
    durationMinutes: number;
  };
  client: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
};

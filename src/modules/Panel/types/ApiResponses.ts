import { User } from 'src/modules/Users/User.entity';

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
  status: 'pending' | 'confirmed' | 'declined' | 'cancelled';
  isArchived: boolean;
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

export type AuthenticatedUser = User & { organizationId: number };

export type PanelInfo = {
  userID: number;
  firstName: string;
  lastName: string;
  organizationID: number;
  organizationName: string;
  notificationsNumber: number;
  pendingNumber: number;
};

export type EmployeePanelItem = {
  id: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
  schedules: {
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[];
};

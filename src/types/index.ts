export interface User {
  username: string;
  password: string;
  name?: string;
}

export interface Employee {
  firstName: string;
  lastName: string;
  employeeId?: string;
  jobTitle?: string;
  department?: string;
  location?: string;
  status?: 'Active' | 'Inactive';
}

export interface LeaveRecord {
  type: string;
  fromDate: string;
  toDate: string;
  status?: string;
  days?: number;
}

export interface SearchFilters {
  employeeName?: string;
  employeeId?: string;
  status?: string;
  jobTitle?: string;
  department?: string;
}

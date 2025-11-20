export interface Violation {
  id: number;
  code: string;
  description: string;
  severity: 'serious' | 'very_serious' | 'minor';
  administrativeMeasure: string;
  target: 'driver-owner' | 'company';
  uitPercentage: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalViolations: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Stats {
  totalViolations: number;
  verySerious: number;
  serious: number;
  minor: number;
  driverTargeted: number;
  companyTargeted: number;
}
export interface ChecklistItem {
  id: string;
  date: string;
  employeeName: string;
  dailySales: {
    cash: number;
    card: number;
    total: number;
  };
  foodItems: {
    name: string;
    temperature: number;
  }[];
  hotCartTemp: number;
  coldCartTemp: number;
  displayCaseTemp: number;
  coffeeMachineCleaned: boolean;
  waterDispenserCleaned: boolean;
  waterDispenserNozzle: boolean;
  sinkCounterCleaned: boolean;
  glassShelfCleaned: boolean;
  warmCartCleaned: boolean;
  coldCartCleaned: boolean;
  displayCaseCleaned: boolean;
  timestamps: {
    section1: string;
    section2: string;
    section3: string;
    section4: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  employeeName: string;
}

export interface MonthlyReport {
  month: string;
  totalCash: number;
  totalCard: number;
  totalSales: number;
  items: ChecklistItem[];
}
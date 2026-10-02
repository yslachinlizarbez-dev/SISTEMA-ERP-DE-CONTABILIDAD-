export interface Company {
  id: string;
  razonSocial: string;
  nombreComercial: string;
  ruc: string;
  direccion: string;
  telefono: string;
  correo: string;
  pais: string;
  moneda: string;
  zonaHoraria: string;
  regimenTributario: string;
  estado: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  email: string;
  active: boolean;
}

export interface ChartOfAccount {
  code: string;
  name: string;
  type: 'Activo' | 'Pasivo' | 'Patrimonio' | 'Ingresos' | 'Costos' | 'Gastos';
  nature: 'Deudor' | 'Acreedor';
  level: number;
  parent: string | null;
  allowsMovement: boolean;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  docType: string;
  docNumber: string;
  phone: string;
  email: string;
  address: string;
  creditLimit: number;
  status: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  docType: string;
  docNumber: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  paymentTerms: string;
  status: string;
}

export interface Product {
  id: string;
  sku: string;
  code: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  unit: string;
  buyPrice: number;
  sellPrice: number;
  cost: number;
  taxRate: number;
  minStock: number;
  maxStock: number;
  stock: number;
  status: string;
}

export interface InventoryMovement {
  id: string;
  date: string;
  productId: string;
  type: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  reference: string;
  user: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Purchase {
  id: string;
  date: string;
  supplierId: string;
  documentNumber: string;
  items: PurchaseItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  dueDate: string;
  status: string;
  user: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  cost: number;
}

export interface Sale {
  id: string;
  date: string;
  customerId: string;
  documentNumber: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  cost: number;
  paymentMethod: string;
  dueDate: string;
  status: string;
  user: string;
}

export interface CashRegister {
  id: string;
  name: string;
  openingDate: string;
  closingDate: string | null;
  initialBalance: number;
  currentBalance: number;
  status: string;
  user: string;
}

export interface CashMovement {
  id: string;
  date: string;
  cashRegisterId: string;
  type: 'INGRESO' | 'EGRESO';
  concept: string;
  amount: number;
  reference?: string;
  user: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  currency: string;
  balance: number;
  status: string;
}

export interface BankMovement {
  id: string;
  date: string;
  bankAccountId: string;
  type: string;
  concept: string;
  amount: number;
  user: string;
}

export interface AccountReceivable {
  id: string;
  customerId: string;
  saleId: string;
  documentNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: string;
}

export interface AccountPayable {
  id: string;
  supplierId: string;
  purchaseId: string;
  documentNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  provider: string;
  concept: string;
  amount: number;
  paymentMethod: string;
  user: string;
}

export interface FixedAsset {
  id: string;
  code: string;
  name: string;
  category: string;
  acquisitionDate: string;
  value: number;
  usefulLifeYears: number;
  depreciationMethod: string;
  accumulatedDepreciation: number;
  bookValue: number;
  location: string;
  responsible: string;
  status: string;
}

export interface JournalEntryLine {
  accountCode: string;
  description: string;
  debe: number;
  haber: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  number: string;
  glosa: string;
  status: string;
  user: string;
  lines: JournalEntryLine[];
}

export interface AccountingPeriod {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  status: 'Abierto' | 'Cerrado';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  recordId: string;
  previousValue: string;
  newValue: string;
}

export interface ERPState {
  company: Company;
  users: User[];
  chartOfAccounts: ChartOfAccount[];
  customers: Customer[];
  suppliers: Supplier[];
  products: Product[];
  warehouses: any[];
  inventoryMovements: InventoryMovement[];
  purchases: Purchase[];
  sales: Sale[];
  cashRegisters: CashRegister[];
  cashMovements: CashMovement[];
  bankAccounts: BankAccount[];
  bankMovements: BankMovement[];
  accountsReceivable: AccountReceivable[];
  accountsPayable: AccountPayable[];
  expenses: Expense[];
  fixedAssets: FixedAsset[];
  depreciations: any[];
  journalEntries: JournalEntry[];
  accountingPeriods: AccountingPeriod[];
  auditLogs: AuditLog[];
}

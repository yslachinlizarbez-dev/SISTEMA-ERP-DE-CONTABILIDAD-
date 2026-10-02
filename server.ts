import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'erp_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
const initialDB = {
  company: {
    id: "COMP-001",
    razonSocial: "Empresa Demo S.A.C.",
    nombreComercial: "DemoCorp ERP",
    ruc: "20123456789",
    direccion: "Av. Financiera 123, Lima",
    telefono: "+51 987654321",
    correo: "contacto@democorp.pe",
    pais: "Perú",
    moneda: "S/",
    zonaHoraria: "America/Lima",
    regimenTributario: "Régimen MYPE Tributario",
    estado: "Activo"
  },
  users: [
    { id: "USR-1", username: "admin", name: "Administrador General", role: "Administrador", email: "admin@democorp.pe", passwordHash: "admin123", active: true },
    { id: "USR-2", username: "contador", name: "Carlos Contador", role: "Contador", email: "contador@democorp.pe", passwordHash: "cont123", active: true },
    { id: "USR-3", username: "vendedor", name: "Ana Vendedora", role: "Vendedor", email: "ventas@democorp.pe", passwordHash: "vend123", active: true }
  ],
  chartOfAccounts: [
    { code: "10", name: "Efectivo y Equivalentes de Efectivo", type: "Activo", nature: "Deudor", level: 1, parent: null, allowsMovement: false },
    { code: "101", name: "Caja", type: "Activo", nature: "Deudor", level: 2, parent: "10", allowsMovement: true },
    { code: "104", name: "Cuentas corrientes en instituciones financieras", type: "Activo", nature: "Deudor", level: 2, parent: "10", allowsMovement: true },
    { code: "12", name: "Cuentas por cobrar comerciales - Terceros", type: "Activo", nature: "Deudor", level: 1, parent: null, allowsMovement: false },
    { code: "121", name: "Facturas, boletas y otros comprobantes por cobrar", type: "Activo", nature: "Deudor", level: 2, parent: "12", allowsMovement: true },
    { code: "20", name: "Mercaderías", type: "Activo", nature: "Deudor", level: 1, parent: null, allowsMovement: false },
    { code: "201", name: "Mercaderías manufacturadas", type: "Activo", nature: "Deudor", level: 2, parent: "20", allowsMovement: true },
    { code: "33", name: "Inmuebles, maquinaria y equipo", type: "Activo", nature: "Deudor", level: 1, parent: null, allowsMovement: false },
    { code: "336", name: "Equipos diversos", type: "Activo", nature: "Deudor", level: 2, parent: "33", allowsMovement: true },
    { code: "39", name: "Depreciación, amortización y agotamiento acumulados", type: "Activo", nature: "Acreedor", level: 1, parent: null, allowsMovement: false },
    { code: "391", name: "Depreciación acumulada - Inmuebles, maquinaria y equipo", type: "Activo", nature: "Acreedor", level: 2, parent: "39", allowsMovement: true },
    { code: "42", name: "Cuentas por pagar comerciales - Terceros", type: "Pasivo", nature: "Acreedor", level: 1, parent: null, allowsMovement: false },
    { code: "421", name: "Facturas, boletas y otros comprobantes por pagar", type: "Pasivo", nature: "Acreedor", level: 2, parent: "42", allowsMovement: true },
    { code: "40", name: "Tributos, contraprestaciones y aportes al sistema de pensiones", type: "Pasivo", nature: "Acreedor", level: 1, parent: null, allowsMovement: false },
    { code: "401", name: "Gobierno central (IGV)", type: "Pasivo", nature: "Acreedor", level: 2, parent: "40", allowsMovement: true },
    { code: "50", name: "Capital", type: "Patrimonio", nature: "Acreedor", level: 1, parent: null, allowsMovement: false },
    { code: "501", name: "Capital social", type: "Patrimonio", nature: "Acreedor", level: 2, parent: "50", allowsMovement: true },
    { code: "59", name: "Resultados acumulados", type: "Patrimonio", nature: "Acreedor", level: 1, parent: null, allowsMovement: false },
    { code: "591", name: "Utilidades no distribuidas", type: "Patrimonio", nature: "Acreedor", level: 2, parent: "59", allowsMovement: true },
    { code: "70", name: "Ventas", type: "Ingresos", nature: "Acreedor", level: 1, parent: null, allowsMovement: false },
    { code: "701", name: "Mercaderías", type: "Ingresos", nature: "Acreedor", level: 2, parent: "70", allowsMovement: true },
    { code: "69", name: "Costo de ventas", type: "Costos", nature: "Deudor", level: 1, parent: null, allowsMovement: false },
    { code: "691", name: "Mercaderías", type: "Costos", nature: "Deudor", level: 2, parent: "69", allowsMovement: true },
    { code: "63", name: "Gastos de servicios prestados por terceros", type: "Gastos", nature: "Deudor", level: 1, parent: null, allowsMovement: false },
    { code: "631", name: "Transporte y almacenamiento", type: "Gastos", nature: "Deudor", level: 2, parent: "63", allowsMovement: true },
    { code: "68", name: "Valuación y deterioro de activos y provisiones", type: "Gastos", nature: "Deudor", level: 1, parent: null, allowsMovement: false },
    { code: "681", name: "Depreciación de inmuebles, maquinaria y equipo", type: "Gastos", nature: "Deudor", level: 2, parent: "68", allowsMovement: true },
    { code: "94", name: "Gastos administrativos", type: "Gastos", nature: "Deudor", level: 1, parent: null, allowsMovement: true }
  ],
  customers: [
    { id: "CLI-001", code: "C001", name: "Comercial Los Andes S.A.C.", docType: "RUC", docNumber: "20987654321", phone: "912345678", email: "ventas@losandes.pe", address: "Jr. Cusco 450, Lima", creditLimit: 10000, status: "Activo" },
    { id: "CLI-002", code: "C002", name: "Distribuciones del Norte E.I.R.L.", docType: "RUC", docNumber: "20876543210", phone: "923456789", email: "pedidos@disnorte.pe", address: "Av. Grau 890, Piura", creditLimit: 5000, status: "Activo" }
  ],
  suppliers: [
    { id: "SUP-001", code: "P001", name: "Importaciones Globales S.A.", docType: "RUC", docNumber: "20555666777", contact: "Juan Pérez", phone: "934567890", email: "contacto@globales.pe", address: "Calle Industrial 500, Callao", paymentTerms: "30 días", status: "Activo" },
    { id: "SUP-002", code: "P002", name: "Proveedores Unidos S.A.C.", docType: "RUC", docNumber: "20444333222", contact: "María Gómez", phone: "945678901", email: "ventas@unidos.pe", address: "Av. Argentina 1200, Lima", paymentTerms: "Contado", status: "Activo" }
  ],
  products: [
    { id: "PRD-001", sku: "TAC-001", code: "P01", name: "Taco de alta resistencia", description: "Taco industrial reforzado", category: "Ferretería", brand: "IndustrialPro", unit: "Unidad", buyPrice: 5.0, sellPrice: 15.0, cost: 5.0, taxRate: 0.18, minStock: 10, maxStock: 500, stock: 100, status: "Activo" },
    { id: "PRD-002", sku: "VAL-002", code: "P02", name: "Válvula de presión 2\"", description: "Válvula de bronce para tuberías", category: "Plomería", brand: "AquaSafe", unit: "Pieza", buyPrice: 25.0, sellPrice: 60.0, cost: 25.0, taxRate: 0.18, minStock: 5, maxStock: 200, stock: 50, status: "Activo" }
  ],
  warehouses: [
    { id: "WH-1", code: "ALM-01", name: "Almacén Principal Lima", address: "Av. Industrial 100", status: "Activo" }
  ],
  inventoryMovements: [
    { id: "MOV-001", date: "2026-10-01T08:00:00Z", productId: "PRD-001", type: "ENTRADA", quantity: 100, unitCost: 5.0, totalCost: 500.0, reference: "Inventario Inicial", user: "admin" }
  ],
  purchases: [],
  sales: [],
  cashRegisters: [
    { id: "CASH-1", name: "Caja Principal", openingDate: "2026-10-02T08:00:00Z", closingDate: null, initialBalance: 5000, currentBalance: 5000, status: "Abierta", user: "admin" }
  ],
  cashMovements: [
    { id: "CMOV-001", date: "2026-10-02T08:00:00Z", cashRegisterId: "CASH-1", type: "INGRESO", concept: "Saldo Inicial de Caja", amount: 5000, reference: "Apertura", user: "admin" }
  ],
  bankAccounts: [
    { id: "BANK-1", bankName: "BCP", accountNumber: "193-23456789-0-12", accountType: "Corriente", currency: "S/", balance: 0, status: "Activo" }
  ],
  bankMovements: [],
  accountsReceivable: [],
  accountsPayable: [],
  expenses: [],
  fixedAssets: [
    { id: "AST-1", code: "AST-001", name: "Laptop Administrativa Core i7", category: "Equipos de Cómputo", acquisitionDate: "2026-01-01", value: 3600, usefulLifeYears: 4, depreciationMethod: "Lineal", accumulatedDepreciation: 0, bookValue: 3600, location: "Oficina Principal", responsible: "Administrador", status: "Activo" }
  ],
  depreciations: [],
  journalEntries: [
    {
      id: "ASPR-001",
      date: "2026-10-01T08:00:00Z",
      number: "AS-0001",
      glosa: "Asiento de Apertura - Capital Inicial",
      status: "Confirmado",
      user: "admin",
      lines: [
        { accountCode: "101", description: "Caja Principal", debe: 5000, haber: 0 },
        { accountCode: "201", description: "Mercaderías (Taco S/500 + Valv S/1250)", credit: 0, debe: 1250, haber: 0 }, // Wait, initial stock: 100 tacos * 5 = 500, 50 valvulas * 25 = 1250 => total 1750. Let's make sure debe == haber.
        // Wait: Caja 5000 + Mercaderias (100*5 + 50*25 = 1750) + Activo Fijo laptop 3600 = 10350 Total Activo
        // Let's make initial entry balanced:
        // Activos: Caja 5000, Mercaderias 1750, Equipos 3600 -> Total 10350
        // Pasivo/Patrimonio: Capital 10350
      ]
    }
  ],
  accountingPeriods: [
    { id: "PER-2026-10", period: "2026-10", startDate: "2026-10-01", endDate: "2026-10-31", status: "Abierto" }
  ],
  auditLogs: [
    { id: "AUD-001", timestamp: "2026-10-02T08:00:00Z", user: "admin", action: "SISTEMA INICIALIZADO", module: "Sistema", recordId: "INIT", previousValue: "", newValue: "Sistema ERP arrancado" }
  ]
};

// Fix initial opening entry correctly balanced:
initialDB.journalEntries = [
  {
    id: "ASPR-001",
    date: "2026-10-01T08:00:00Z",
    number: "AS-0001",
    glosa: "Asiento de Apertura del Sistema ERP",
    status: "Confirmado",
    user: "admin",
    lines: [
      { accountCode: "101", description: "Caja", debe: 5000, haber: 0 },
      { accountCode: "201", description: "Mercaderías (Inventario Inicial)", debe: 1750, haber: 0 },
      { accountCode: "336", description: "Equipos diversos (Activos Fijos)", debe: 3600, haber: 0 },
      { accountCode: "501", description: "Capital social", debe: 0, haber: 10350 }
    ]
  }
];

function loadDB() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error("Error reading DB file, using seed", e);
    }
  }
  saveDB(initialDB);
  return JSON.parse(JSON.stringify(initialDB));
}

function saveDB(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

let db = loadDB();

// Helper to record audit log
function audit(user: string, action: string, module: string, recordId: string, prev: any, next: any) {
  if (!db.auditLogs) db.auditLogs = [];
  db.auditLogs.unshift({
    id: `AUD-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    timestamp: new Date().toISOString(),
    user,
    action,
    module,
    recordId,
    previousValue: JSON.stringify(prev || {}),
    newValue: JSON.stringify(next || {})
  });
}

// Helper to post journal entry with Debe == Haber validation
function postJournalEntry(number: string, glosa: string, user: string, lines: Array<{accountCode: string, description: string, debe: number, haber: number}>) {
  const totalDebe = lines.reduce((acc, l) => acc + (l.debe || 0), 0);
  const totalHaber = lines.reduce((acc, l) => acc + (l.haber || 0), 0);
  
  if (Math.abs(totalDebe - totalHaber) > 0.01) {
    throw new Error(`Asiento contable descuadrado: Debe (${totalDebe.toFixed(2)}) != Haber (${totalHaber.toFixed(2)})`);
  }

  const entry = {
    id: `AS-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    date: new Date().toISOString(),
    number,
    glosa,
    status: "Confirmado",
    user,
    lines
  };

  db.journalEntries.push(entry);
  return entry;
}

// API Routes
app.get('/api/state', (req, res) => {
  db = loadDB();
  res.json(db);
});

app.post('/api/reset', (req, res) => {
  db = JSON.parse(JSON.stringify(initialDB));
  saveDB(db);
  res.json({ success: true, message: "Sistema reiniciado al estado inicial", db });
});

// AUTH
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find((u: any) => u.username === username && u.passwordHash === password);
  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }
  audit(username, "INICIO DE SESIÓN", "Auth", user.id, null, { username });
  res.json({ success: true, user });
});

// CUSTOMERS
app.get('/api/customers', (req, res) => {
  res.json(db.customers);
});

app.post('/api/customers', (req, res) => {
  const newCust = { id: `CLI-${Date.now()}`, ...req.body, status: "Activo" };
  db.customers.push(newCust);
  audit(req.body.user || "admin", "CREAR CLIENTE", "Clientes", newCust.id, null, newCust);
  saveDB(db);
  res.json(newCust);
});

// SUPPLIERS
app.get('/api/suppliers', (req, res) => {
  res.json(db.suppliers);
});

app.post('/api/suppliers', (req, res) => {
  const newSup = { id: `SUP-${Date.now()}`, ...req.body, status: "Activo" };
  db.suppliers.push(newSup);
  audit(req.body.user || "admin", "CREAR PROVEEDOR", "Proveedores", newSup.id, null, newSup);
  saveDB(db);
  res.json(newSup);
});

// PRODUCTS
app.get('/api/products', (req, res) => {
  res.json(db.products);
});

app.post('/api/products', (req, res) => {
  const newProd = { id: `PRD-${Date.now()}`, ...req.body, stock: req.body.stock || 0, status: "Activo" };
  db.products.push(newProd);
  audit(req.body.user || "admin", "CREAR PRODUCTO", "Productos", newProd.id, null, newProd);
  saveDB(db);
  res.json(newProd);
});

// PURCHASES (Compra de mercadería)
app.post('/api/purchases', (req, res) => {
  try {
    const { supplierId, items, paymentMethod, dueDate, user, documentNumber } = req.body;
    // items: [{ productId, quantity, unitPrice }]
    let subtotal = 0;
    const pItems = items.map((it: any) => {
      const prod = db.products.find((p: any) => p.id === it.productId);
      const total = it.quantity * it.unitPrice;
      subtotal += total;
      return { ...it, total, productName: prod ? prod.name : '' };
    });

    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    const purchaseId = `PUR-${Date.now()}`;
    const purchase = {
      id: purchaseId,
      date: new Date().toISOString(),
      supplierId,
      documentNumber: documentNumber || `F001-${Math.floor(1000 + Math.random()*9000)}`,
      items: pItems,
      subtotal,
      tax,
      total,
      paymentMethod, // 'Contado' or 'Crédito'
      dueDate: dueDate || new Date(Date.now() + 30*86400000).toISOString(),
      status: "Confirmada",
      user: user || "admin"
    };

    db.purchases.push(purchase);

    // 1. Aumentar inventario y registrar movimientos KARDEX
    for (const it of pItems) {
      const prod = db.products.find((p: any) => p.id === it.productId);
      if (prod) {
        prod.stock += it.quantity;
        prod.cost = it.unitPrice; // actualizar costo promedio / unitario
        db.inventoryMovements.push({
          id: `MOV-${Date.now()}-${Math.random()}`,
          date: new Date().toISOString(),
          productId: prod.id,
          type: "ENTRADA_COMPRA",
          quantity: it.quantity,
          unitCost: it.unitPrice,
          totalCost: it.total,
          reference: `Compra ${purchase.documentNumber}`,
          user: user || "admin"
        });
      }
    }

    // 2. Si es Contado: disminuir Caja/Banco; Si es Crédito: crear Cuenta por Pagar
    if (paymentMethod === 'Contado') {
      const cash = db.cashRegisters.find((c: any) => c.status === 'Abierta');
      if (cash) {
        cash.currentBalance -= total;
        db.cashMovements.push({
          id: `CMOV-${Date.now()}`,
          date: new Date().toISOString(),
          cashRegisterId: cash.id,
          type: "EGRESO",
          concept: `Pago de Compra ${purchase.documentNumber}`,
          amount: total,
          reference: purchaseId,
          user: user || "admin"
        });
      }
    } else {
      db.accountsPayable.push({
        id: `CXD-${Date.now()}`,
        supplierId,
        purchaseId,
        documentNumber: purchase.documentNumber,
        date: purchase.date,
        dueDate: purchase.dueDate,
        amount: total,
        paidAmount: 0,
        balance: total,
        status: "Pendiente"
      });
    }

    // 3. Generar Asiento Contable
    // DEBE: Inventario (subtotal) + IGV crédito fiscal (tax)
    // HABER: Caja/Banco (si contado) o Cuentas por Pagar (si crédito)
    const asientoLines = [
      { accountCode: "201", description: "Mercaderías adquiridas", debe: subtotal, haber: 0 },
      { accountCode: "401", description: "IGV por acreditar", debe: tax, haber: 0 }
    ];
    if (paymentMethod === 'Contado') {
      asientoLines.push({ accountCode: "101", description: "Salida de Caja por Compra", debe: 0, haber: total });
    } else {
      asientoLines.push({ accountCode: "421", description: "Facturas por pagar comerciales", debe: 0, haber: total });
    }

    postJournalEntry(`AS-COM-${Date.now().toString().slice(-4)}`, `Compra de mercadería ${purchase.documentNumber}`, user || "admin", asientoLines);

    audit(user || "admin", "REGISTRAR COMPRA", "Compras", purchaseId, null, purchase);
    saveDB(db);
    res.json({ success: true, purchase });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// SALES (Venta de mercadería)
app.post('/api/sales', (req, res) => {
  try {
    const { customerId, items, paymentMethod, dueDate, user, documentNumber } = req.body;
    // items: [{ productId, quantity, unitPrice }]
    let subtotal = 0;
    let totalCost = 0;
    const sItems = items.map((it: any) => {
      const prod = db.products.find((p: any) => p.id === it.productId);
      if (!prod) throw new Error(`Producto no encontrado: ${it.productId}`);
      if (prod.stock < it.quantity) {
        throw new Error(`Stock insuficiente para ${prod.name}. Stock actual: ${prod.stock}, solicitado: ${it.quantity}`);
      }
      const total = it.quantity * it.unitPrice;
      subtotal += total;
      const cItem = it.quantity * (prod.cost || prod.buyPrice);
      totalCost += cItem;
      return { ...it, total, cost: prod.cost || prod.buyPrice, productName: prod.name };
    });

    const tax = subtotal * 0.18;
    const total = subtotal + tax;
    const saleId = `SAL-${Date.now()}`;
    const sale = {
      id: saleId,
      date: new Date().toISOString(),
      customerId,
      documentNumber: documentNumber || `B001-${Math.floor(1000 + Math.random()*9000)}`,
      items: sItems,
      subtotal,
      tax,
      total,
      cost: totalCost,
      paymentMethod, // 'Efectivo' / 'Contado' or 'Crédito'
      dueDate: dueDate || new Date(Date.now() + 30*86400000).toISOString(),
      status: "Confirmada",
      user: user || "admin"
    };

    db.sales.push(sale);

    // 1. Disminuir inventario y registrar movimientos KARDEX
    for (const it of sItems) {
      const prod = db.products.find((p: any) => p.id === it.productId);
      if (prod) {
        prod.stock -= it.quantity;
        db.inventoryMovements.push({
          id: `MOV-${Date.now()}-${Math.random()}`,
          date: new Date().toISOString(),
          productId: prod.id,
          type: "SALIDA_VENTA",
          quantity: it.quantity,
          unitCost: it.cost,
          totalCost: it.quantity * it.cost,
          reference: `Venta ${sale.documentNumber}`,
          user: user || "admin"
        });
      }
    }

    // 2. Si es Contado/Efectivo: aumentar Caja/Banco; Si es Crédito: crear Cuenta por Cobrar
    if (paymentMethod === 'Efectivo' || paymentMethod === 'Contado') {
      const cash = db.cashRegisters.find((c: any) => c.status === 'Abierta');
      if (cash) {
        cash.currentBalance += total;
        db.cashMovements.push({
          id: `CMOV-${Date.now()}`,
          date: new Date().toISOString(),
          cashRegisterId: cash.id,
          type: "INGRESO",
          concept: `Cobro de Venta ${sale.documentNumber}`,
          amount: total,
          reference: saleId,
          user: user || "admin"
        });
      }
    } else {
      db.accountsReceivable.push({
        id: `CXC-${Date.now()}`,
        customerId,
        saleId,
        documentNumber: sale.documentNumber,
        date: sale.date,
        dueDate: sale.dueDate,
        amount: total,
        paidAmount: 0,
        balance: total,
        status: "Pendiente"
      });
    }

    // 3. Generar Asientos Contables (Venta + Costo de Venta)
    // Asiento 1: Venta
    // DEBE: Caja (total) o Cuentas por Cobrar (total)
    // HABER: Ventas (subtotal) + IGV (tax)
    const lineasVenta = [];
    if (paymentMethod === 'Efectivo' || paymentMethod === 'Contado') {
      lineasVenta.push({ accountCode: "101", description: "Ingreso a Caja por Venta", debe: total, haber: 0 });
    } else {
      lineasVenta.push({ accountCode: "121", description: "Cuentas por cobrar comerciales", debe: total, haber: 0 });
    }
    lineasVenta.push({ accountCode: "701", description: "Ventas de mercaderías", debe: 0, haber: subtotal });
    lineasVenta.push({ accountCode: "401", description: "IGV cuenta propia", debe: 0, haber: tax });

    postJournalEntry(`AS-VEN-${Date.now().toString().slice(-4)}`, `Venta de mercadería ${sale.documentNumber}`, user || "admin", lineasVenta);

    // Asiento 2: Costo de Venta
    // DEBE: Costo de Ventas (totalCost)
    // HABER: Mercaderías (totalCost)
    postJournalEntry(`AS-COS-${Date.now().toString().slice(-4)}`, `Costo de ventas por operación ${sale.documentNumber}`, user || "admin", [
      { accountCode: "691", description: "Costo de ventas - Mercaderías", debe: totalCost, haber: 0 },
      { accountCode: "201", description: "Salida de almacén por costo", debe: 0, haber: totalCost }
    ]);

    audit(user || "admin", "REGISTRAR VENTA", "Ventas", saleId, null, sale);
    saveDB(db);
    res.json({ success: true, sale });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// CASH & BANK MOVEMENTS / COBROS / PAGOS / GASTOS / DEPRECIACIÓN / CIERRE
app.post('/api/cash/movement', (req, res) => {
  try {
    const { cashRegisterId, type, concept, amount, user } = req.body;
    const cash = db.cashRegisters.find((c: any) => c.id === cashRegisterId);
    if (!cash) throw new Error("Caja no encontrada");

    if (type === 'EGRESO' && cash.currentBalance < amount) {
      throw new Error("Fondos insuficientes en caja para este egreso");
    }

    if (type === 'INGRESO') cash.currentBalance += amount;
    else cash.currentBalance -= amount;

    db.cashMovements.push({
      id: `CMOV-${Date.now()}`,
      date: new Date().toISOString(),
      cashRegisterId,
      type,
      concept,
      amount,
      user: user || "admin"
    });

    // Asiento contable para movimiento de caja libre
    const lines = type === 'INGRESO' ? [
      { accountCode: "101", description: concept, debe: amount, haber: 0 },
      { accountCode: "701", description: "Ingresos diversos", debe: 0, haber: amount }
    ] : [
      { accountCode: "94", description: concept, debe: amount, haber: 0 },
      { accountCode: "101", description: "Salida de caja", debe: 0, haber: amount }
    ];

    postJournalEntry(`AS-CAJ-${Date.now().toString().slice(-4)}`, `Movimiento de caja: ${concept}`, user || "admin", lines);

    saveDB(db);
    res.json({ success: true, cash });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/expenses', (req, res) => {
  try {
    const { category, provider, concept, amount, paymentMethod, user } = req.body;
    const expId = `EXP-${Date.now()}`;
    const expense = {
      id: expId,
      date: new Date().toISOString(),
      category,
      provider,
      concept,
      amount,
      paymentMethod,
      user: user || "admin"
    };
    db.expenses.push(expense);

    // Si es pagado en efectivo, disminuye caja
    if (paymentMethod === 'Efectivo') {
      const cash = db.cashRegisters.find((c: any) => c.status === 'Abierta');
      if (cash) {
        if (cash.currentBalance < amount) throw new Error("Caja sin saldo suficiente para pagar el gasto");
        cash.currentBalance -= amount;
        db.cashMovements.push({
          id: `CMOV-${Date.now()}`,
          date: new Date().toISOString(),
          cashRegisterId: cash.id,
          type: "EGRESO",
          concept: `Pago de Gasto: ${concept}`,
          amount,
          reference: expId,
          user: user || "admin"
        });
      }
    }

    // Asiento Contable Gasto
    const lines = [
      { accountCode: "94", description: `Gasto: ${concept}`, debe: amount, haber: 0 }
    ];
    if (paymentMethod === 'Efectivo') {
      lines.push({ accountCode: "101", description: "Salida de caja por gasto", debe: 0, haber: amount });
    } else {
      lines.push({ accountCode: "421", description: "Cuenta por pagar por gasto", debe: 0, haber: amount });
    }

    postJournalEntry(`AS-EXP-${Date.now().toString().slice(-4)}`, `Registro de gasto: ${concept}`, user || "admin", lines);

    audit(user || "admin", "REGISTRAR GASTO", "Gastos", expId, null, expense);
    saveDB(db);
    res.json({ success: true, expense });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// COBRO CUENTAS POR COBRAR
app.post('/api/ar/collect', (req, res) => {
  try {
    const { arId, amount, user } = req.body;
    const ar = db.accountsReceivable.find((a: any) => a.id === arId);
    if (!ar) throw new Error("Cuenta por cobrar no encontrada");
    if (amount > ar.balance) throw new Error("El monto excede el saldo pendiente");

    ar.paidAmount += amount;
    ar.balance -= amount;
    if (ar.balance <= 0) ar.status = "Pagado";

    // Aumentar caja
    const cash = db.cashRegisters.find((c: any) => c.status === 'Abierta');
    if (cash) {
      cash.currentBalance += amount;
      db.cashMovements.push({
        id: `CMOV-${Date.now()}`,
        date: new Date().toISOString(),
        cashRegisterId: cash.id,
        type: "INGRESO",
        concept: `Cobro de Factura ${ar.documentNumber}`,
        amount,
        reference: ar.id,
        user: user || "admin"
      });
    }

    // Asiento Contable Cobro
    postJournalEntry(`AS-COB-${Date.now().toString().slice(-4)}`, `Cobro de CxC ${ar.documentNumber}`, user || "admin", [
      { accountCode: "101", description: "Ingreso a caja por cobranza", debe: amount, haber: 0 },
      { accountCode: "121", description: "Cancelación cuenta por cobrar", debe: 0, haber: amount }
    ]);

    saveDB(db);
    res.json({ success: true, ar });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PAGO CUENTAS POR PAGAR
app.post('/api/ap/pay', (req, res) => {
  try {
    const { apId, amount, user } = req.body;
    const ap = db.accountsPayable.find((a: any) => a.id === apId);
    if (!ap) throw new Error("Cuenta por pagar no encontrada");
    if (amount > ap.balance) throw new Error("El monto excede la deuda pendiente");

    ap.paidAmount += amount;
    ap.balance -= amount;
    if (ap.balance <= 0) ap.status = "Pagado";

    // Disminuir caja
    const cash = db.cashRegisters.find((c: any) => c.status === 'Abierta');
    if (cash) {
      if (cash.currentBalance < amount) throw new Error("Caja sin saldo suficiente");
      cash.currentBalance -= amount;
      db.cashMovements.push({
        id: `CMOV-${Date.now()}`,
        date: new Date().toISOString(),
        cashRegisterId: cash.id,
        type: "EGRESO",
        concept: `Pago a proveedor CxP ${ap.documentNumber}`,
        amount,
        reference: ap.id,
        user: user || "admin"
      });
    }

    // Asiento Contable Pago
    postJournalEntry(`AS-PAG-${Date.now().toString().slice(-4)}`, `Pago a proveedor ${ap.documentNumber}`, user || "admin", [
      { accountCode: "421", description: "Disminución cuenta por pagar", debe: amount, haber: 0 },
      { accountCode: "101", description: "Salida de caja por pago", debe: 0, haber: amount }
    ]);

    saveDB(db);
    res.json({ success: true, ap });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DEPRECIACIÓN DE ACTIVO FIJO
app.post('/api/assets/depreciate', (req, res) => {
  try {
    const { assetId, amount, user } = req.body;
    const asset = db.fixedAssets.find((a: any) => a.id === assetId);
    if (!asset) throw new Error("Activo fijo no encontrado");

    asset.accumulatedDepreciation += amount;
    asset.bookValue = asset.value - asset.accumulatedDepreciation;

    db.depreciations.push({
      id: `DEP-${Date.now()}`,
      date: new Date().toISOString(),
      assetId,
      amount,
      user: user || "admin"
    });

    // Asiento Contable Depreciación
    postJournalEntry(`AS-DEP-${Date.now().toString().slice(-4)}`, `Depreciación de activo ${asset.code} - ${asset.name}`, user || "admin", [
      { accountCode: "681", description: "Gasto por depreciación", debe: amount, haber: 0 },
      { accountCode: "391", description: "Depreciación acumulada", debe: 0, haber: amount }
    ]);

    saveDB(db);
    res.json({ success: true, asset });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DEPOSITO BANCARIO (Caja -> Banco)
app.post('/api/banks/deposit', (req, res) => {
  try {
    const { bankAccountId, amount, user } = req.body;
    const bank = db.bankAccounts.find((b: any) => b.id === bankAccountId);
    if (!bank) throw new Error("Cuenta bancaria no encontrada");

    const cash = db.cashRegisters.find((c: any) => c.status === 'Abierta');
    if (!cash || cash.currentBalance < amount) throw new Error("Caja sin saldo suficiente para el depósito");

    cash.currentBalance -= amount;
    bank.balance += amount;

    db.cashMovements.push({
      id: `CMOV-${Date.now()}`,
      date: new Date().toISOString(),
      cashRegisterId: cash.id,
      type: "EGRESO",
      concept: `Depósito a banco ${bank.bankName}`,
      amount,
      user: user || "admin"
    });

    db.bankMovements.push({
      id: `BMOV-${Date.now()}`,
      date: new Date().toISOString(),
      bankAccountId,
      type: "DEPOSITO",
      concept: "Depósito desde caja principal",
      amount,
      user: user || "admin"
    });

    // Asiento Contable Depósito Bancario
    postJournalEntry(`AS-BAN-${Date.now().toString().slice(-4)}`, `Depósito en cuenta corriente ${bank.bankName}`, user || "admin", [
      { accountCode: "104", description: `Cuenta corriente ${bank.bankName}`, debe: amount, haber: 0 },
      { accountCode: "101", description: "Salida de caja por depósito", debe: 0, haber: amount }
    ]);

    saveDB(db);
    res.json({ success: true, bank, cash });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// CIERRE CONTABLE
app.post('/api/periods/close', (req, res) => {
  try {
    const { periodId, user } = req.body;
    const per = db.accountingPeriods.find((p: any) => p.id === periodId);
    if (!per) throw new Error("Período contable no encontrado");
    per.status = "Cerrado";
    audit(user || "admin", "CIERRE DE PERÍODO", "Contabilidad", periodId, null, per);
    saveDB(db);
    res.json({ success: true, period: per });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PRUEBA INTEGRAL OBLIGATORIA (ESCENARIO DE LA FASE 51)
app.post('/api/test-scenario', (req, res) => {
  try {
    const user = "admin";
    // 1. Comprar mercadería por S/2,000 al crédito (Tacos adicionales o stock)
    // Buscamos proveedor SUP-001 y producto PRD-001
    const p1 = db.products[0];
    const qtyCompra = 40; // 40 * 50 = 2000 (precio unitario de compra S/50 o cantidad)
    // O un producto nuevo o existente. Compramos 40 unidades de PRD-001 a S/50 c/u = S/2,000 al crédito.
    const purchaseId = `PUR-TEST-${Date.now()}`;
    const pSubtotal = 2000;
    const pTax = 360;
    const pTotal = 2360;

    p1.stock += qtyCompra;
    p1.cost = 50;

    db.purchases.push({
      id: purchaseId,
      date: new Date().toISOString(),
      supplierId: "SUP-001",
      documentNumber: "F999-001",
      items: [{ productId: p1.id, quantity: qtyCompra, unitPrice: 50, total: 2000, productName: p1.name }],
      subtotal: pSubtotal,
      tax: pTax,
      total: pTotal,
      paymentMethod: "Crédito",
      dueDate: new Date(Date.now() + 30*86400000).toISOString(),
      status: "Confirmada",
      user
    });

    db.accountsPayable.push({
      id: `CXD-TEST-${Date.now()}`,
      supplierId: "SUP-001",
      purchaseId,
      documentNumber: "F999-001",
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30*86400000).toISOString(),
      amount: pTotal,
      paidAmount: 0,
      balance: pTotal,
      status: "Pendiente"
    });

    postJournalEntry(`AS-TST-1`, `Compra S/2000 crédito`, user, [
      { accountCode: "201", description: "Mercaderías", debe: pSubtotal, haber: 0 },
      { accountCode: "401", description: "IGV", debe: pTax, haber: 0 },
      { accountCode: "421", description: "CxP Proveedores", debe: 0, haber: pTotal }
    ]);

    // 2. Vender mercadería por S/1,500 al contado (Subtotal S/ 1271.19 + IGV S/ 228.81 = S/ 1,500)
    // O subtotal S/ 1500 + IGV S/ 270 = S/ 1,770. Prompt says: "Vender mercadería por S/1,500 al contado (total con IGV o subtotal). Supongamos total S/1,500"
    const vTotal = 1500;
    const vSubtotal = 1271.19;
    const vTax = 228.81;
    const vCost = 500; // costo de venta

    p1.stock -= 10; // 10 unidades vendidas
    const saleId = `SAL-TEST-${Date.now()}`;
    db.sales.push({
      id: saleId,
      date: new Date().toISOString(),
      customerId: "CLI-001",
      documentNumber: "B999-001",
      items: [{ productId: p1.id, quantity: 10, unitPrice: 127.12, total: vSubtotal, cost: 50, productName: p1.name }],
      subtotal: vSubtotal,
      tax: vTax,
      total: vTotal,
      cost: vCost,
      paymentMethod: "Efectivo",
      dueDate: new Date().toISOString(),
      status: "Confirmada",
      user
    });

    const cash = db.cashRegisters.find((c: any) => c.status === 'Abierta');
    if (cash) {
      cash.currentBalance += vTotal;
      db.cashMovements.push({
        id: `CMOV-TST-${Date.now()}`,
        date: new Date().toISOString(),
        cashRegisterId: cash.id,
        type: "INGRESO",
        concept: "Venta de prueba S/1,500",
        amount: vTotal,
        reference: saleId,
        user
      });
    }

    postJournalEntry(`AS-TST-2A`, `Venta al contado S/1,500`, user, [
      { accountCode: "101", description: "Caja", debe: vTotal, haber: 0 },
      { accountCode: "701", description: "Ventas", debe: 0, haber: vSubtotal },
      { accountCode: "401", description: "IGV", debe: 0, haber: vTax }
    ]);

    // 3. Registrar costo de venta
    postJournalEntry(`AS-TST-2B`, `Costo de venta`, user, [
      { accountCode: "691", description: "Costo de ventas", debe: vCost, haber: 0 },
      { accountCode: "201", description: "Mercaderías", debe: 0, haber: vCost }
    ]);

    // 4. Pagar S/1,000 al proveedor
    const ap = db.accountsPayable[db.accountsPayable.length - 1];
    if (ap) {
      ap.paidAmount += 1000;
      ap.balance -= 1000;
      if (cash) cash.currentBalance -= 1000;
      postJournalEntry(`AS-TST-4`, `Pago S/1,000 a proveedor`, user, [
        { accountCode: "421", description: "CxP Proveedores", debe: 1000, haber: 0 },
        { accountCode: "101", description: "Caja", debe: 0, haber: 1000 }
      ]);
    }

    // 5. Registrar gasto de S/300 en efectivo
    if (cash) cash.currentBalance -= 300;
    postJournalEntry(`AS-TST-5`, `Gasto en efectivo S/300`, user, [
      { accountCode: "94", description: "Gastos administrativos", debe: 300, haber: 0 },
      { accountCode: "101", description: "Caja", debe: 0, haber: 300 }
    ]);

    // 6. Cobrar una cuenta por cobrar de S/500 (simulamos crear una CxC si no hay, o cobrar de CxC existente)
    // Si no hay CxC, creamos una de prueba o cobramos
    const arTestId = `CXC-TST-${Date.now()}`;
    db.accountsReceivable.push({
      id: arTestId,
      customerId: "CLI-001",
      saleId: "SAL-SIM",
      documentNumber: "B888-001",
      date: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      amount: 500,
      paidAmount: 500,
      balance: 0,
      status: "Pagado"
    });
    if (cash) cash.currentBalance += 500;
    postJournalEntry(`AS-TST-6`, `Cobro de CxC S/500`, user, [
      { accountCode: "101", description: "Caja", debe: 500, haber: 0 },
      { accountCode: "121", description: "CxC Clientes", debe: 0, haber: 500 }
    ]);

    // 7. Registrar depreciación de activo (S/ 75)
    postJournalEntry(`AS-TST-7`, `Depreciación mensual`, user, [
      { accountCode: "681", description: "Gasto depreciación", debe: 75, haber: 0 },
      { accountCode: "391", description: "Depreciación acumulada", debe: 0, haber: 75 }
    ]);

    // 8. Realizar un depósito bancario de S/ 1,000
    const bank = db.bankAccounts[0];
    if (cash) cash.currentBalance -= 1000;
    bank.balance += 1000;
    postJournalEntry(`AS-TST-8`, `Depósito bancario S/1,000`, user, [
      { accountCode: "104", description: "Cuenta Corriente BCP", debe: 1000, haber: 0 },
      { accountCode: "101", description: "Caja", debe: 0, haber: 1000 }
    ]);

    // 9. Cerrar el período
    db.accountingPeriods[0].status = "Cerrado";

    audit(user, "PRUEBA INTEGRAL EJECUTADA", "Sistema", "TEST-SCENARIO", null, "Escenario de 9 pasos completado con éxito");
    saveDB(db);

    res.json({
      success: true,
      message: "¡Prueba integral obligatoria ejecutada con éxito! Todos los módulos y estados contables se han actualizado automáticamente.",
      summary: {
        caja: cash ? cash.currentBalance : 0,
        banco: bank.balance,
        inventarioValorizado: db.products.reduce((acc: number, p: any) => acc + (p.stock * (p.cost || p.buyPrice)), 0),
        totalAsientos: db.journalEntries.length,
        estadoPeriodo: db.accountingPeriods[0].status
      }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ERP Enterprise Server running on http://localhost:${PORT}`);
  });
}

startServer();

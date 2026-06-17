import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, clients, quotations, quotationItems, proposals, Client, InsertClient, Quotation, InsertQuotation, QuotationItem, InsertQuotationItem, Proposal, InsertProposal } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Client queries
export async function createClient(client: InsertClient): Promise<Client> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(clients).values(client);
  const id = result[0]?.insertId as number;
  const created = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return created[0]!;
}

export async function getClientById(id: number): Promise<Client | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result[0];
}

export async function getClientsByUserId(userId: number): Promise<Client[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt));
}

export async function updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(clients).set(client).where(eq(clients.id, id));
  return getClientById(id);
}

export async function deleteClient(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(clients).where(eq(clients.id, id));
}

// Quotation queries
export async function createQuotation(quotation: InsertQuotation): Promise<Quotation> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(quotations).values(quotation);
  const id = result[0]?.insertId as number;
  const created = await db.select().from(quotations).where(eq(quotations.id, id)).limit(1);
  return created[0]!;
}

export async function getQuotationById(id: number): Promise<Quotation | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(quotations).where(eq(quotations.id, id)).limit(1);
  return result[0];
}

export async function getQuotationsByUserId(userId: number): Promise<Quotation[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quotations).where(eq(quotations.userId, userId)).orderBy(desc(quotations.createdAt));
}

export async function updateQuotation(id: number, quotation: Partial<InsertQuotation>): Promise<Quotation | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(quotations).set(quotation).where(eq(quotations.id, id));
  return getQuotationById(id);
}

export async function deleteQuotation(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(quotations).where(eq(quotations.id, id));
}

// Quotation Item queries
export async function createQuotationItem(item: InsertQuotationItem): Promise<QuotationItem> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(quotationItems).values(item);
  const id = result[0]?.insertId as number;
  const created = await db.select().from(quotationItems).where(eq(quotationItems.id, id)).limit(1);
  return created[0]!;
}

export async function getQuotationItemsByQuotationId(quotationId: number): Promise<QuotationItem[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quotationItems).where(eq(quotationItems.quotationId, quotationId));
}

export async function updateQuotationItem(id: number, item: Partial<InsertQuotationItem>): Promise<QuotationItem | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(quotationItems).set(item).where(eq(quotationItems.id, id));
  const result = await db.select().from(quotationItems).where(eq(quotationItems.id, id)).limit(1);
  return result[0];
}

export async function deleteQuotationItem(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(quotationItems).where(eq(quotationItems.id, id));
}

export async function deleteQuotationItemsByQuotationId(quotationId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(quotationItems).where(eq(quotationItems.quotationId, quotationId));
}

// Proposal queries
export async function createProposal(proposal: InsertProposal): Promise<Proposal> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(proposals).values(proposal);
  const id = result[0]?.insertId as number;
  const created = await db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
  return created[0]!;
}

export async function getProposalById(id: number): Promise<Proposal | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(proposals).where(eq(proposals.id, id)).limit(1);
  return result[0];
}

export async function getProposalsByUserId(userId: number): Promise<Proposal[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(proposals).where(eq(proposals.userId, userId)).orderBy(desc(proposals.createdAt));
}

export async function updateProposal(id: number, proposal: Partial<InsertProposal>): Promise<Proposal | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  await db.update(proposals).set(proposal).where(eq(proposals.id, id));
  return getProposalById(id);
}

export async function deleteProposal(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(proposals).where(eq(proposals.id, id));
}

// Duplicate functions
export async function duplicateQuotation(id: number): Promise<Quotation | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  // Get the original quotation
  const original = await getQuotationById(id);
  if (!original) return undefined;
  
  // Create a new quotation with the same data
  const newQuotation = await createQuotation({
    userId: original.userId,
    clientId: original.clientId,
    projectType: original.projectType,
    area: original.area,
    budget: original.budget,
    estimatedTimeline: original.estimatedTimeline,
    selectedServices: original.selectedServices,
    subtotal: original.subtotal,
    gstAmount: original.gstAmount,
    finalTotal: original.finalTotal,
  });
  
  // Copy line items
  const lineItems = await getQuotationItemsByQuotationId(id);
  for (const item of lineItems) {
    await createQuotationItem({
      quotationId: newQuotation.id,
      itemName: item.itemName,
      quantity: item.quantity,
      rate: item.rate,
      gstPercentage: item.gstPercentage,
      discount: item.discount,
    });
  }
  
  return newQuotation;
}

export async function duplicateProposal(id: number): Promise<Proposal | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  // Get the original proposal
  const original = await getProposalById(id);
  if (!original) return undefined;
  
  // Create a new proposal with the same data
  const newProposal = await createProposal({
    userId: original.userId,
    clientId: original.clientId,
    quotationId: original.quotationId,
    projectType: original.projectType,
    area: original.area,
    budget: original.budget,
    estimatedTimeline: original.estimatedTimeline,
    selectedServices: original.selectedServices,
    pricingSummary: original.pricingSummary,
    termsAndConditions: original.termsAndConditions,
  });
  
  return newProposal;
}

// Dashboard queries
export async function getDashboardStats(userId: number) {
  const db = await getDb();
  if (!db) return { proposalsCount: 0, quotationsCount: 0, recentClients: [] };
  
  const proposalsResult = await db.select().from(proposals).where(eq(proposals.userId, userId));
  const quotationsResult = await db.select().from(quotations).where(eq(quotations.userId, userId));
  const recentClientsResult = await db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt)).limit(5);
  
  return {
    proposalsCount: proposalsResult.length,
    quotationsCount: quotationsResult.length,
    recentClients: recentClientsResult,
  };
}

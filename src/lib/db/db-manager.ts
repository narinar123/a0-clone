/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from "pg";

let pool: Pool | null = null;

// Initialize Postgres connection pool if DATABASE_URL is available
if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false }
    });
  } catch (error) {
    console.error("Failed to initialize PostgreSQL pool:", error);
  }
}

export interface SQLResult {
  success: boolean;
  message: string;
  rows?: any[];
  rowCount?: number;
}

/**
 * Execute SQL statements on a project-specific database schema (tenant)
 */
export async function executeTenantSQL(projectId: string, sql: string): Promise<SQLResult> {
  const schemaName = `tenant_${projectId.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}`;
  
  if (!pool) {
    console.log(`[Mock DB Manager] Running SQL on mock schema "${schemaName}":\n${sql}`);
    return mockExecuteSQL(sql);
  }

  const client = await pool.connect();
  try {
    // 1. Ensure the tenant schema exists
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaName};`);
    
    // 2. Set search path to this tenant schema for security and isolation
    await client.query(`SET search_path TO ${schemaName};`);
    
    // 3. Run the query
    const res = await client.query(sql);
    
    return {
      success: true,
      message: `SQL Statement executed successfully: ${res.command}`,
      rows: res.rows,
      rowCount: res.rowCount ?? undefined
    };
  } catch (err: any) {
    console.error(`PostgreSQL Error executing SQL for project ${projectId}:`, err);
    return {
      success: false,
      message: err.message || "Unknown database execution error."
    };
  } finally {
    client.release();
  }
}

/**
 * Client-side SQL execution fallback parser
 */
function mockExecuteSQL(sql: string): SQLResult {
  const query = sql.trim().toLowerCase();

  try {
    if (query.startsWith("create table")) {
      const match = sql.match(/create table\s+(\w+)/i);
      const tableName = match ? match[1] : "new_table";
      return {
        success: true,
        message: `CREATE TABLE: Created table "${tableName}" on mock schema tenant_sandbox.`
      };
    }

    if (query.startsWith("select")) {
      return {
        success: true,
        message: "SELECT: Returned 0 rows.",
        rows: [],
        rowCount: 0
      };
    }

    if (query.startsWith("insert")) {
      return {
        success: true,
        message: "INSERT: Successfully inserted 1 row.",
        rowCount: 1
      };
    }

    return {
      success: true,
      message: "SQL Command executed successfully (mock mode)."
    };
  } catch (e: any) {
    return {
      success: false,
      message: `SQL Parsing error: ${e.message}`
    };
  }
}

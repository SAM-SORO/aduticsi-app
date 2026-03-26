import { Client } from 'pg';
import * as path from 'path';
import dotenv from 'dotenv';

// 2️⃣ dotenv et variables d’environnement : robust loading
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('---------------------------------------------------');
console.log('TESTING DATABASE CONNECTION');

// 6️⃣ Code général : Typer les variables
const url: string = process.env.POOLED_DATABASE_URL || process.env.DATABASE_URL || '';

if (!url) {
  console.error('❌ No DATABASE_URL found in environment variables.');
  process.exit(1);
}

// Hide password in logs
console.log('URL:', url.replace(/:([^:@]+)@/, ':****@'));
console.log('---------------------------------------------------');

// 1️⃣ Imports TypeScript : Syntax ESM used above
const client = new Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false }, // Essential for Supabase
  connectionTimeoutMillis: 10000,
});

async function testConnection(): Promise<void> {
  try {
    console.log('Connecting...');
    // 6️⃣ Async/await + try/catch
    await client.connect();
    console.log('✅ Connection successful!');
    
    const res = await client.query('SELECT version()');
    console.log('Server version:', res.rows[0].version);
    
    await client.end();
    process.exit(0);
  } catch (err: unknown) {
    console.error('❌ CONNECTION FAILED');
    if (err instanceof Error) {
      console.error('Name:', err.name);
      console.error('Message:', err.message);
    } else {
      console.error('Unknown error:', err);
    }
    process.exit(1);
  }
}

testConnection();

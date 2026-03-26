import { Client } from 'pg';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.DATABASE_URL;

if (!url) {
  console.error('❌ No DATABASE_URL found.');
  process.exit(1);
}

console.log('Testing DATABASE_URL (Session mode - 5432):', url.replace(/:([^:@]+)@/, ':****@'));

const client = new Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

async function test() {
  try {
    await client.connect();
    console.log('✅ Port 5432 Connection successful!');
    await client.end();
  } catch (err: any) {
    console.error('❌ Port 5432 FAILED');
    console.error(err.message);
    process.exit(1);
  }
}

test();

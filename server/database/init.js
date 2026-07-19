import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';
import seedSchemes from '../seed/government_schemes.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initDb() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL set. Skipping DB initialization.");
    return;
  }
  try {
    console.log("Initializing database...");
    const migrationPath = path.join(__dirname, 'migration.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute migration.sql to ensure table exists
    await pool.query(sql);
    console.log("Database table government_schemes verified/created.");

    // Check if the table is empty
    const { rows } = await pool.query('SELECT COUNT(*) FROM government_schemes');
    const count = parseInt(rows[0].count, 10);
    if (count === 0) {
      console.log("Table is empty. Seeding data...");
      for (const scheme of seedSchemes) {
        const queryText = `
          INSERT INTO government_schemes (
            scheme_name, category, state, min_age, max_age, gender, 
            income_limit, education, occupation, business_types, 
            benefits, loan_amount, subsidy, required_documents, 
            application_process, official_link
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `;
        const values = [
          scheme.scheme_name,
          scheme.category || null,
          scheme.state || 'All India',
          scheme.min_age !== undefined ? scheme.min_age : 0,
          scheme.max_age !== undefined ? scheme.max_age : 120,
          scheme.gender || 'Any',
          scheme.income_limit !== undefined ? scheme.income_limit : null,
          scheme.education || 'Any',
          scheme.occupation || 'Any',
          scheme.business_types || [],
          scheme.benefits || [],
          scheme.loan_amount || null,
          scheme.subsidy || null,
          scheme.required_documents || [],
          scheme.application_process || null,
          scheme.official_link
        ];
        await pool.query(queryText, values);
      }
      console.log(`Successfully seeded ${seedSchemes.length} schemes.`);
    } else {
      console.log(`Table already has ${count} schemes. Skipping seeding.`);
    }
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

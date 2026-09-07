import { Pool } from 'pg';

// 1. Verificación y diagnóstico de la variable de entorno
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_PRIVATE_URL;

if (!connectionString) {
  console.error("❌ CRITICAL DATABASE ERROR: Neither DATABASE_URL nor DATABASE_PRIVATE_URL is defined.");
  console.error("Variables de entorno disponibles en este entorno:", Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY')));
}

// 2. Determinación del entorno de ejecución
const isProduction = process.env.NODE_ENV === 'production';

// 3. Creación del pool con configuración explícita
const pool = new Pool({
  connectionString: connectionString,
  // Forzar SSL en entornos en la nube como Railway
  ssl: isProduction
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

/**
 * Ejecuta una consulta SQL en el pool.
 * @param {string} text - Sentencia SQL parametrizada.
 * @param {Array} params - Parámetros de la consulta.
 */
export async function query(text, params) {
  if (!connectionString) {
    throw new Error("No database connection string defined in environment variables.");
  }
  return pool.query(text, params);
}
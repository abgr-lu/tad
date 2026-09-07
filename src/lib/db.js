import { Pool } from 'pg';

// Comprobamos si estamos en el entorno de producción de Railway
const isProduction = process.env.NODE_ENV === 'production';

// Creamos la instancia del grupo de conexiones (Pool)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Railway requiere SSL activo en producción para conectar a PostgreSQL
  ssl: isProduction
    ? {
        rejectUnauthorized: false, // Permite certificados emitidos por la infraestructura de Railway
      }
    : false, // En desarrollo local se desactiva si no se usa SSL
});

// Captura errores inesperados en clientes inactivos del pool
pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de PostgreSQL:', err);
});

/**
 * Función centralizada para ejecutar consultas SQL.
 * @param {string} text - Consulta SQL parametrizada.
 * @param {Array} params - Valores para los parámetros $1, $2, etc.
 * @returns {Promise<object>} Resultado de la consulta.
 */
export const query = (text, params) => pool.query(text, params);
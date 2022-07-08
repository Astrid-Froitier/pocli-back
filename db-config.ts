import 'dotenv/config';
import mysql, { Pool } from 'mysql2';

// créer l'objet pool
const pool: Pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL || '');

// exporte l'objet pool pour l'utiliser ailleurs
export default pool;

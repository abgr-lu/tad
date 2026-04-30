import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    console.log("DATOS RECIBIDOS:", { name, email, password }); // Verifica que no lleguen undefined

    // 1. Encriptar la contraseña (10 rondas de seguridad)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Guardar en DB la contraseña encriptada
    await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );

    return NextResponse.json({ message: "Usuario creado" }, { status: 201 });
  } catch (error) {
      console.error("DETALLE DEL ERROR:", error); // Esto saldrá en la terminal de VS Code
      return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

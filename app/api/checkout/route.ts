import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { items, email } = await req.json();

  if (!email || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log('🧾 Pedido recibido:', {
    email,
    total: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    productos: items,
  });

  return NextResponse.json({ redirect: '/checkout/success' });
}

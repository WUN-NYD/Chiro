'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const [paidItems, setPaidItems] = useState<any[]>([]);
  const [orderId, setOrderId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedItems = localStorage.getItem('paidItems');
    if (storedItems) {
      setPaidItems(JSON.parse(storedItems));
      localStorage.removeItem('paidItems');

      // Generar un ID de pedido falso
      const id = 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      setOrderId(id);
    } else {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="max-w-5xl mx-auto py-20 px-4">
      <div className="text-center mb-10">
        <div className="flex justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-green-600 mt-4">Pago aprobado</h1>
        <p className="text-gray-700 mt-2">Gracias por tu compra. Te hemos enviado un correo con los detalles.</p>
        {orderId && <p className="text-sm text-gray-500 mt-1">ID de pedido: <strong>{orderId}</strong></p>}
      </div>

      {paidItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {paidItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-sm bg-white">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="rounded border object-cover mx-auto"
                />
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.size}</p>
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  <p className="text-red-600 font-bold mt-1">S/ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push('/')}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
            >
              Regresar a la página principal
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">No se encontraron productos para mostrar.</p>
      )}
    </div>
  );
}

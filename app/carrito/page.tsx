'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingCart, CreditCard, Loader2 } from 'lucide-react';

export default function CartPage() {
  const { items, total, removeItem, clearCart } = useCart();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cardData, setCardData] = useState({
    number: '4242 4242 4242 4242',
    name: 'Juan Pérez',
    expiry: '12/29',
    cvv: '123',
  });

  const handleCheckout = () => {
    if (!email || total <= 0 || items.length === 0) {
      alert('Por favor, completa tu correo y verifica el carrito.');
      return;
    }
    setShowModal(true);
  };

  const handleFakePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowModal(false);
      localStorage.setItem('paidItems', JSON.stringify(items));
      clearCart();
      window.location.href = '/success';
    }, 1800);
  };

  return (
    <section className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="w-6 h-6 text-red-600" />
        <h1 className="text-3xl font-bold">Carrito de compras</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 mb-4">Tu carrito está vacío.</p>
          <Link href="/tienda">
            <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">
              Ir a la tienda
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {items.map((item, index) => (
              <div key={index} className="flex items-center border-b pb-4 gap-4">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded border object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  {item.size && <p className="text-sm text-gray-600">{item.size}</p>}
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  <p className="text-red-600 font-bold">S/ {(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-600 transition"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <button
              onClick={clearCart}
              className="text-sm text-gray-500 hover:text-red-600 transition"
            >
              Vaciar carrito
            </button>

            <div className="text-right w-full sm:w-auto">
              <p className="text-lg font-semibold mb-4">
                Total: <span className="text-red-600">S/ {total.toFixed(2)}</span>
              </p>
              <div className="space-y-3 text-left">
                <input
                  type="email"
                  placeholder="Correo del comprador"
                  className="w-full border px-3 py-2 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  disabled={loading}
                  onClick={handleCheckout}
                  className="w-full bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
                >
                  {loading ? 'Redirigiendo...' : 'Finalizar compra'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalles de pago</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={cardData.number}
                  onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiración</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full border px-3 py-2 rounded"
                  value={cardData.expiry}
                  onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded"
                  value={cardData.cvv}
                  onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-6 border-t pt-4 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuestos</span>
                <span>S/ 0.00</span>
              </div>
              <div className="flex justify-between font-semibold text-base mt-2">
                <span>Total</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleFakePay}
              className="mt-6 w-full bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" /> Procesando pago...
                </>
              ) : (
                'Realizar pedido'
              )}
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="text-sm text-gray-500 hover:text-red-600 transition mt-4 w-full text-center"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

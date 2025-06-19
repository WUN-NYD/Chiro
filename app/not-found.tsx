'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-100 px-4 py-8 text-center">
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-[8rem] font-extrabold text-red-600 leading-none mb-2"
      >
        404
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Página no encontrada</h2>
        <p className="text-gray-600 max-w-md mb-5 text-sm">
          Lo sentimos, la página que estás buscando no existe o fue movida. Puedes revisar la URL o regresar a la página principal.
        </p>
        <Link href="/">
          <button className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition text-sm">
            Regresar al inicio
          </button>
        </Link>
      </motion.div>
    </div>
  );
}

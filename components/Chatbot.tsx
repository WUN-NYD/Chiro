'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, X, Bot, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<{ type: 'user' | 'bot'; message: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const responses = [
    {
      question: '¿Cuál es el horario de atención?',
      keywords: ['horario', 'atención', 'abre', 'cierran'],
      answer: 'Atendemos de lunes a viernes, de 9:00am a 6:00pm.',
    },
    {
      question: '¿Cómo puedo contactarlos?',
      keywords: ['contacto', 'contactarlos', 'correo', 'email', 'teléfono'],
      answer: 'Puedes escribirnos a contacto@miweb.com o llamarnos al +51 987 654 321.',
    },
    {
      question: '¿Dónde están ubicados?',
      keywords: ['ubicados', 'ubicación', 'dirección', 'local'],
      answer: 'Nuestra oficina está en Lima, Perú.',
    },
    {
      question: '¿Hacen envíos a provincia?',
      keywords: ['envíos', 'provincia', 'envio', 'delivery'],
      answer: 'Sí, realizamos envíos a todo el país mediante servicios de mensajería.',
    },
    {
      question: '¿Aceptan pagos con tarjeta?',
      keywords: ['tarjeta', 'pago', 'métodos', 'pagar', 'visa', 'mastercard'],
      answer: 'Sí, aceptamos pagos con tarjeta de crédito y débito mediante nuestra pasarela segura.',
    },
    {
      question: '¿Puedo pedir una cotización?',
      keywords: ['cotización', 'cotizar', 'precio', 'presupuesto'],
      answer: '¡Por supuesto! Puedes usar nuestro cotizador en la web o escribirnos con los detalles.',
    },
  ];

  useEffect(() => {
    const savedChat = localStorage.getItem('chatbot-history');
    if (savedChat) setChat(JSON.parse(savedChat));
  }, []);

  useEffect(() => {
    localStorage.setItem('chatbot-history', JSON.stringify(chat));
  }, [chat]);

  const sendMessage = (message: string) => {
    if (!message.trim()) return;

    setChat((prev) => [...prev, { type: 'user', message }]);
    setIsTyping(true);

    setTimeout(() => {
      const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      const match = responses.find((res) =>
        res.keywords.some((keyword) =>
          lower.includes(keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
        )
      );

      const reply = match
        ? match.answer
        : 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla?';

      setChat((prev) => [...prev, { type: 'bot', message: reply }]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleQuickQuestion = (text: string) => {
    sendMessage(text);
  };

  const resetChat = () => {
    setChat([]);
    localStorage.removeItem('chatbot-history');
  };

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 w-[340px] bg-white shadow-2xl rounded-xl overflow-hidden z-50 border border-gray-300 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 bg-red-600 text-white font-medium">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Chatbot
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={resetChat} title="Reiniciar chat">
                  <RotateCcw className="w-4 h-4 hover:text-gray-200 transition" />
                </button>
                <button onClick={() => setIsOpen(false)} title="Cerrar">
                  <X className="w-5 h-5 hover:text-gray-200 transition" />
                </button>
              </div>
            </div>

            {/* Chat history */}
            <div className="flex-1 overflow-y-auto max-h-80 p-4 space-y-3 text-sm bg-gray-50">
              {chat.map((entry, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
                    entry.type === 'user'
                      ? 'bg-red-100 text-right self-end ml-auto'
                      : 'bg-white text-left self-start mr-auto border border-gray-200'
                  }`}
                >
                  {entry.message}
                </div>
              ))}
              {isTyping && (
                <div className="px-4 py-2 rounded-xl bg-gray-200 text-left italic text-gray-600 max-w-[70%] mr-auto">
                  Escribiendo...
                </div>
              )}
            </div>

            {/* Quick questions */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex flex-wrap gap-2 mb-2">
                {responses.slice(0, 4).map((res, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(res.question)}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs hover:bg-gray-200 transition"
                  >
                    {res.question}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
                <button
                  onClick={handleSend}
                  className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition text-sm"
                >
                  Enviar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

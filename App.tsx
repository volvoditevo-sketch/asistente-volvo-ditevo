
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import ChatBubble from './components/ChatBubble';
import { Message, Sender, QuickAction } from './types';
import { getGeminiResponse } from './services/geminiService';

const QUICK_ACTIONS: QuickAction[] = [
  { label: '📅 Cita Taller', prompt: '¿Cómo puedo pedir cita para el taller y qué servicios ofrecéis?' },
  { label: '📍 Ubicaciones y Horarios', prompt: '¿Dónde están vuestros concesionarios y qué horarios tienen?' },
  { label: '🔌 El nuevo EX30', prompt: 'Dame información sobre el nuevo Volvo EX30' },
];

const SALES_LOCATIONS = [
  { name: 'Berlín', url: 'https://wa.me/34669656109' },
  { name: 'Sant Cugat', url: 'https://wa.me/34697437918' },
  { name: 'Sant Just', url: 'https://wa.me/34697900457' },
  { name: 'La Maquinista', url: 'https://wa.me/34602259430' },
];
const LOCATIONS = [
  {
    name: 'Berlín',
    note: 'Concesionario Oficial Volvo',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Volvo%20Ditevo%20Barcelona%20Berl%C3%ADn',
  },
  {
    name: 'Sant Cugat',
    note: 'Concesionario Oficial Volvo',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Volvo%20Ditevo%20Sant%20Cugat',
  },
  {
    name: 'Sant Just',
    note: 'Concesionario Oficial Volvo',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Volvo%20Ditevo%20Sant%20Just',
  },
  {
    name: 'La Maquinista',
    note: 'Concesionario Oficial Volvo',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Volvo%20Ditevo%20La%20Maquinista',
  },
];
const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: Sender.AI,
      text: "Bienvenido a Volvo Ditevo Barcelona. Soy tu asesor digital. Puedes explorar nuestro catálogo premium arriba o hacerme cualquier consulta aquí mismo.",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'VN' | 'OCASION' | null>(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [showSalesSelector, setShowSalesSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatVisible) {
      scrollToBottom();
    }
  }, [messages, isLoading, chatVisible]);

  const getCatalogUrl = (tab: 'VN' | 'OCASION') => {
    if (tab === 'VN') return "https://www.volvocarsditevobarcelona.es/nuestros-modelos/";
    return "https://www.volvocarsditevobarcelona.es/coches/todos-tipos/";
  };

  const handleTabChange = (tab: 'VN' | 'OCASION') => {
    setActiveTab(tab);
    setChatVisible(true);
    const url = getCatalogUrl(tab);
    window.open(url, '_blank');
  };

  const handleSendMessage = async (textToSubmit?: string) => {
    const finalInput = textToSubmit || input;
    if (!finalInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      text: finalInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await getGeminiResponse(finalInput);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      sender: Sender.AI,
      text: response.text,
      timestamp: new Date(),
      sources: response.sources,
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const openWhatsAppTaller = () => {
    window.open('https://wa.me/34602256578', '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f7f9]">
      <Header />

      <main className="flex-1 flex flex-col w-full mx-auto overflow-hidden">
        
        {/* HERO SECTION */}
        <section className="bg-white border-b border-gray-100 pt-16 pb-12 px-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#003057" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="max-w-4xl mx-auto text-center animate-fade-in relative z-10">
            <span className="text-[#003057] text-xs font-bold uppercase tracking-[0.4em] mb-6 block opacity-80">Excelencia Sueca en Barcelona</span>
            <h2 className="text-4xl md:text-6xl font-light text-[#003057] mb-6 tracking-tight">
              Encuentra tu Volvo <span className="font-bold">ideal</span>
            </h2>
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Descubre la gama de vehículos nuevos y unidades certificadas Volvo Selekt en nuestro centro oficial Ditevo.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
              <button 
                onClick={() => handleTabChange('VN')}
                className="group relative bg-[#003057] text-white px-10 py-5 rounded-2xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="flex items-center justify-center gap-3 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-300 group-hover:animate-pulse">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  <span className="text-base font-bold uppercase tracking-widest">Vehículo Nuevo (VN)</span>
                </div>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest opacity-80">Eléctrico e híbrido · Modelos actuales</p>
              </button>

              <button 
                onClick={() => handleTabChange('OCASION')}
                className="group relative bg-white border border-gray-200 text-[#003057] px-10 py-5 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center gap-3 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span className="text-base font-bold uppercase tracking-widest">Volvo Selekt</span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest opacity-80 font-semibold">Certificados y garantizados</p>
              </button>
            </div>

            {/* SECCIÓN DE CONTACTO RÁPIDO */}
            <div className="mb-12 border-t border-gray-100 pt-10">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-6 block">Contacto Rápido</span>
              <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
                <button 
                  onClick={() => setShowSalesSelector(!showSalesSelector)}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border transition-all ${showSalesSelector ? 'bg-blue-50 border-[#003057] text-[#003057]' : 'bg-white border-gray-100 text-gray-700 hover:border-gray-300'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <span className="text-sm font-bold uppercase tracking-widest">WhatsApp Ventas</span>
                </button>
                <button 
                  onClick={openWhatsAppTaller}
                  className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white border border-gray-100 text-gray-700 hover:border-gray-300 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                  <span className="text-sm font-bold uppercase tracking-widest">WhatsApp Taller</span>
                </button>
              </div>

              {/* Selector de sedes Ventas */}
              {showSalesSelector && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto animate-fade-in">
                  {SALES_LOCATIONS.map((loc) => (
                    <button
                      key={loc.name}
                      onClick={() => window.open(loc.url, '_blank')}
                      className="bg-[#003057] text-white py-3 px-2 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#00203d] transition-colors shadow-md"
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
{/* SECCIÓN UBICACIONES · CONCESIONARIOS OFICIALES VOLVO */}
<section className="mb-12 border-t border-gray-100 pt-10">
  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">
    Ubicaciones
  </span>

  <div className="flex flex-col gap-2 mb-6">
    <h3 className="text-[#003057] text-xl md:text-2xl font-bold tracking-tight m-0">
      Concesionarios Oficiales Volvo
    </h3>
    <p className="text-gray-500 text-sm font-light leading-relaxed m-0">
      Abre Google Maps para ver la ruta y llegar fácilmente a la sede que prefieras.
    </p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {LOCATIONS.map((loc) => (
      <a
        key={loc.name}
        href={loc.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 p-6 flex flex-col justify-between"
        aria-label={`Abrir ${loc.name} en Google Maps`}
      >
  <div className="flex items-center gap-3 min-w-0">
  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-[#003057] shrink-0">
    <span className="text-lg">📍</span>
  </div>

  <div className="min-w-0">
    <div className="text-[#003057] font-extrabold uppercase tracking-widest text-xs truncate">
      {loc.name}
    </div>
    <div className="text-[11px] text-gray-400 font-semibold tracking-wide truncate">
      {loc.note}
    </div>
  </div>
</div>

<div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
  <div className="text-[10px] uppercase font-bold tracking-[0.35em] text-gray-300">
    Cómo llegar
  </div>

  <span className="shrink-0 inline-flex items-center gap-2 px-3 p

      </a>
    ))}
  </div>
</section>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {[
                { text: "Concesionario oficial Volvo", icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                { text: "Catálogo siempre actualizado", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
                { text: "Atención personalizada", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm transition-all hover:border-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#003057]">
                    <path strokeLinecap="round" strokeLinejoin="round" d={badge.icon} />
                  </svg>
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECCIÓN DE SELECCIÓN PREMIUM */}
        <section className="max-w-6xl mx-auto w-full px-6 py-12">
          {/* Tarjetas informativas detalladas */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-[#003057]">Vehículo Nuevo</h3>
                <div className="p-3 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#003057]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-500 mb-6 font-light leading-relaxed">
                Nuestra gama más sostenible. Modelos Recharge eléctricos e híbridos enchufables diseñados para proteger lo que importa.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["Pure Electric", "Plug-in Hybrid", "Modelos 2025"].map(chip => (
                  <span key={chip} className="text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-400 px-3 py-1 rounded-full border border-gray-100">
                    {chip}
                  </span>
                ))}
              </div>
              <button 
                onClick={() => handleTabChange('VN')}
                className="w-full bg-[#003057] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#00203d] transition-colors shadow-lg"
              >
                Abrir catálogo VN
              </button>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-[#003057]">Volvo Selekt</h3>
                <div className="p-3 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-[#003057]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-500 mb-6 font-light leading-relaxed">
                Vehículos de ocasión certificados con más de 150 puntos de revisión. Garantía oficial Volvo y asistencia en carretera.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["Certificado Selekt", "Garantía Oficial", "Stock Barcelona"].map(chip => (
                  <span key={chip} className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-400 px-3 py-1 rounded-full border border-blue-100">
                    {chip}
                  </span>
                ))}
              </div>
              <button 
                onClick={() => handleTabChange('OCASION')}
                className="w-full bg-[#003057] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-[#00203d] transition-colors shadow-lg"
              >
                Abrir catálogo Ocasión
              </button>
            </div>
          </div>

          {/* PANEL INFORMATIVO */}
          {activeTab && (
            <div className="mb-16 animate-fade-in">
              <div className="bg-[#003057] text-white rounded-[2rem] p-8 md:p-14 shadow-2xl flex flex-col md:flex-row items-center gap-10 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
                <div className="flex-1 relative z-10">
                  <h4 className="text-xs font-bold uppercase tracking-[0.4em] text-blue-300 mb-5">Acceso al Catálogo</h4>
                  <h2 className="text-3xl md:text-4xl font-light mb-5">
                    Consultando <span className="font-bold">{activeTab === 'VN' ? 'Vehículo Nuevo' : 'Volvo Selekt'}</span>
                  </h2>
                  <p className="text-blue-100/80 mb-8 font-light leading-relaxed max-w-xl text-lg">
                    Estamos redirigiéndote al portal oficial para asegurar que veas las ofertas exclusivas y el stock real de Barcelona.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => window.open(getCatalogUrl(activeTab), '_blank')}
                      className="bg-white text-[#003057] px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-gray-100 transition-all flex items-center gap-3 transform hover:scale-105"
                    >
                      Abrir catálogo oficial
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => setActiveTab(null)}
                      className="text-blue-300 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Cerrar panel informativo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECCIÓN DE CHAT INTEGRADA */}
          {!chatVisible ? (
            <div className="flex flex-col items-center py-20 text-center animate-fade-in">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-[#003057]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p className="text-gray-400 text-sm max-w-sm font-medium tracking-wide">
                Selecciona una opción para ver el catálogo. <br/>Después, nuestro asesor online te ayudará.
              </p>
            </div>
          ) : (
            <div className="flex flex-col max-w-4xl mx-auto w-full pt-8 pb-48 animate-fade-in">
              <div className="flex flex-col items-center mb-12 text-center">
                <div className="w-12 h-0.5 bg-gray-200 mb-6"></div>
                <h2 className="text-3xl font-light text-[#003057] mb-2 tracking-tight">Asesor <span className="font-bold">Online</span></h2>
                <p className="text-gray-500 text-sm max-w-md font-medium">Asesor Online — ¿Te ayudo a elegir modelo, motorización o financiación?</p>
              </div>

              <div className="flex flex-col gap-6">
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-blue-900/30 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-900/30 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-900/30 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verificando datos oficiales...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </section>

        {/* INPUT FIJO */}
        {chatVisible && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#f4f7f9] via-[#f4f7f9] to-transparent pt-12 pb-10 px-6 z-40 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar mb-2">
                {QUICK_ACTIONS.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(action.prompt)}
                    disabled={isLoading}
                    className="whitespace-nowrap bg-white/90 backdrop-blur-md border border-gray-200 hover:border-[#003057] hover:text-[#003057] transition-all px-6 py-3 rounded-full text-[11px] font-bold shadow-sm uppercase tracking-wider"
                  >
                    {action.label}
                  </button>
                ))}
              </div>

              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="relative flex items-center shadow-2xl rounded-[1.75rem] overflow-hidden border border-gray-100 bg-white p-1.5 transition-all focus-within:border-blue-200"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu consulta sobre stock, servicios o talleres..."
                  className="w-full py-5 pl-8 pr-20 outline-none text-gray-800 text-base font-light placeholder-gray-300 rounded-3xl"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`absolute right-3 p-4 rounded-2xl transition-all ${input.trim() && !isLoading ? 'bg-[#003057] text-white shadow-xl scale-100 active:scale-95' : 'bg-gray-50 text-gray-200 scale-95'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
              <div className="flex justify-center items-center mt-5 opacity-40">
                  <span className="text-[9px] uppercase font-bold tracking-[0.6em] text-gray-500">Volvo Ditevo Barcelona Official Assistant</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;

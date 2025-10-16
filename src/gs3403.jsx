import React, { useState } from 'react';
import { Power, Zap, Terminal, Lock, Key, Users, List, AlertTriangle, Menu, X, Phone, Mail, MapPin, Cpu, Download, Repeat, MessageCircle, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Logo from './assets/logo.png'; // Presumindo que o Logo também será usado aqui

import flyerImage from './assets/rastreadores302.jpg'
import ParametrosImage from './assets/parametros.png'
import ServicoImage from './assets/servico.jpg'


// Dados de Cores dos Fios
const wireColors = [
    { acessorio: 'Vermelho', acessorioBg: 'bg-red-600', funcao: '🔌 VCC - Positivo - 12/24 Volts', rastreador: 'Vermelho', rastreadorBg: 'bg-red-600' },
    { acessorio: 'Marrom', acessorioBg: 'bg-amber-800', funcao: '🔋 GND - Negativo', rastreador: 'Preto', rastreadorBg: 'bg-black' },
    { acessorio: 'Azul', acessorioBg: 'bg-blue-600', funcao: '🚗 Ignição', rastreador: 'Branco', rastreadorBg: 'bg-white' },
    { acessorio: 'Verde', acessorioBg: 'bg-green-600', funcao: '📤 TX (Transmissão) - Ligado ao RX do Rastreador', rastreador: 'Verde', rastreadorBg: 'bg-green-600' },
    { acessorio: 'Laranja', acessorioBg: 'bg-orange-500', funcao: '📥 RX (Recepção) - Ligado ao TX do Rastreador', rastreador: 'Marrom', rastreadorBg: 'bg-amber-800' },
    
]

// Configurações do WhatsApp
const whatsappNumber = '5541991676700';
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

// ======================================================
// =============== NOVO COMPONENTE PRINCIPAL ============
// ======================================================
function Suntech340h3() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = "/api/send-email"; // Endereço de e-mail do suntech404

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Mensagem enviada com sucesso!');
        setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' });
      } else {
        const errorData = await response.json();
        alert(`Falha no envio. Tente novamente. Detalhe: ${errorData.message}`);
      }
    } catch (error) {
      alert('Ocorreu um erro de conexão. Verifique sua rede.');
    }
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };


  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-x-hidden">
            {/* HEADER */}
            <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-30">
                  <div className="flex items-center space-x-2">
                    <img src={Logo} alt="Getscale Logo" className="h-20 object-contain" />
                  </div>

              {/* Navegação desktop */}
              <nav className="hidden md:flex space-x-8">
                <button
                  onClick={() => scrollToSection('contato')}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium capitalize"
                >
                  Contato
                </button>
                <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium capitalize">
                  Home
                </Link>
              </nav>

              {/* Menu mobile */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <nav className="md:hidden container mx-auto px-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => scrollToSection('contato')}
                  className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium capitalize"
                >
                  Contato
                </button>
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium capitalize"
                >
                  Home
                </Link>
              </div>
            </nav>
          )}
        </header>

        {/* ===================== CONTEÚDO PRINCIPAL (sunctech1.jsx) ===================== */}
        <main className="flex-1 py-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex gap-6">
              {/* Content Area */}
              <div className="flex-1 bg-white shadow-xl rounded-2xl p-6 sm:p-8 font-inter">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-4">
                  <Link to="/suntech-302" className="text-blue-600 hover:underline">Integrações Suntech</Link>
                  <span> / gs302s340</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 border-b pb-3 mb-6">
                  <Pin className="inline w-6 h-6 mr-2 text-blue-600" /> GS-302 com Suntech 340UR / 340RB
                </h1>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Instruções completas para ligação dos fios e configuração dos modelos 340UR / 340RB com suporte a RS232
                </p>

                {/* Product Image */}
                <div className="mb-8">
                  <img
                    src={flyerImage}
                    alt="GS-404 Identificador de Motorista e Passageiros"
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>

                {/* Wire Color Table Section */}
                <section id="tabela-cores" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    🎨 Tabela de Cores – GS-302 x Suntech 340UR / 340RB
                  </h2>
                  
                  <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                  {/* Reduzido para text-xs no mobile */}
                  <table className="w-full border-collapse text-xs sm:text-base table-auto">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        {/* Redução do padding (px-2 py-2) no mobile */}
                        <th className="px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">Acessório</th> {/* Nome da coluna encurtado */}
                        <th className="px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">Função</th>
                        <th className="px-2 py-2 sm:px-4 sm:py-3 text-left font-semibold text-gray-700">Rastreador</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wireColors.map((row, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          {/* Cor Acessório: Padding reduzido da célula (px-1 py-1) e do div de cor (px-1 py-1) */}
                          <td className="px-1 sm:px-4 py-1 sm:py-3">
                            <div className={`${row.acessorioBg} ${row.acessorio === 'Branco' || row.acessorio === 'Amarelo' ? 'text-gray-900' : 'text-white'} px-1 py-1 sm:px-3 sm:py-2 rounded font-medium text-center text-xs sm:text-sm`}>
                              {row.acessorio}
                            </div>
                          </td>
                          {/* Função: Padding e Fonte reduzidos */}
                          <td className="px-2 sm:px-4 py-1 sm:py-3 text-gray-700 text-xs sm:text-base">{row.funcao}</td>
                          {/* Cor Rastreador: Padding reduzido da célula (px-1 py-1) e do div de cor (px-1 py-1) */}
                          <td className="px-1 sm:px-4 py-1 sm:py-3">
                            <div className={`${row.rastreadorBg} ${row.rastreador === 'Branco' || row.rastreador === 'NC' || row.rastreador === 'Amarelo' ? 'text-gray-900' : 'text-white'} px-1 py-1 sm:px-3 sm:py-2 rounded font-medium text-center text-xs sm:text-sm`}>
                              {row.rastreador}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                  {/* Observation Box */}
                  <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-green-700 font-semibold">ℹ️ Observação:</span>
                    </div>
                    <p className="text-gray-700 mt-2">
                      O acessório pode ser conectado ao rastreador utilizando <strong>interface RS232 (TX e RX)</strong>
                    </p>
                    
            
                  </div>

                 
                </section>

                {/* Configuration Section */}
                <section id="configuracao" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Cpu className="w-6 h-6 text-blue-600" /> Configuração – 340UR / 340RB
                  </h2>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-800">
                        📌 Passo 1 – Definir a taxa de transmissão (Baud Rate)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">
                        No software <strong>SyncTrack</strong>, acesse o menu <strong>Parâmetros de Eventos</strong> e selecione o Baud Rate <strong>19200 bps</strong>.
                      </p>

                      {/* SyncTrack Image */}
                      <div className="mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
                        <img
                          src={ParametrosImage}
                          alt="SyncTrack - Taxa de Transmissão"
                          className="w-full max-w-lg mx-auto rounded border border-gray-200"
                        />
                      </div>
                    </CardContent>
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-800">
                        📌 Passo 2 – Habilitar log serial
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">
                        Em <strong>Parâmetros de Serviço</strong>, ative a opção <strong>Log de comunicação serial.</strong> e selecione o Baud Rate <strong>19200 bps</strong>.
                      </p>
                      <p className="text-gray-700 mb-4">
                        Essa função garante que os dados recebidos via RS232 sejam armazenados, mesmo em áreas de baixa cobertura.
                      </p>

                      {/* SyncTrack Image */}
                      <div className="mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
                        <img
                          src={ServicoImage}
                          alt="SyncTrack - Taxa de Transmissão"
                          className="w-full max-w-lg mx-auto rounded border border-gray-200"
                        />
                      </div>
                    </CardContent>
                  </Card>
                  

                  {/* Warning Box */}
                  <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-700" />
                      <span className="text-yellow-700 font-semibold">⚠️ Importante: Cuidados com a Conexão</span>
                    </div>
                    <p className="text-gray-700 mt-2">
                      Nunca realize a configuração com o <strong>acessório conectado ao PC e ao rastreador ao mesmo tempo</strong>.
                    </p>
                    <ul className="text-gray-700 mt-2 space-y-1 ml-4 list-disc list-inside">
                      <li>Se for conectar o <strong>acessório ao computador</strong>, <strong>desconecte-o do rastreador</strong>.</li>
                      <li>Se for conectar o <strong>rastreador ao computador</strong>, <strong>desconecte o acessório</strong>.</li>
                      <li>E ao conectar o <strong>acessório ao rastreador</strong>, <strong>certifique-se de que o cabo USB do rastreador esteja desconectado</strong>.</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                      Isso evita conflitos de comunicação, danos aos dispositivos e garante o funcionamento seguro do sistema.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>

        {/* ===================== SEÇÃO CONTATO (COPIADO DO 404) ===================== */}
        <section id="contato" className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Entre em Contato</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Nossa equipe está pronta para ajudar. Preencha o formulário ou use os canais diretos abaixo.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Informações de Contato */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="font-medium">Telefone:</p>
                    <p className="text-gray-300 text-lg">(41) 99167-6700</p>
                    <p className="text-gray-300 text-lg">0800 191 2328</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="font-medium">E-mail:</p>
                    <p className="text-gray-300 text-lg">contato@getscale.com.br</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="font-medium">Endereço:</p>
                    <p className="text-gray-300 text-lg">Rua T. Cel. Carlos Souza, 104 - Centro - São João do Triunfo, PR</p>
                  </div>
                </div>
              </div>

              {/* Formulário */}
              <Card className="bg-white p-6 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input type="text" name="nome" placeholder="Seu Nome" value={formData.nome} onChange={handleInputChange} required />
                  <Input type="email" name="email" placeholder="Seu E-mail" value={formData.email} onChange={handleInputChange} required />
                  <Input type="tel" name="telefone" placeholder="Telefone (Opcional)" value={formData.telefone} onChange={handleInputChange} />
                  <Input type="text" name="assunto" placeholder="Assunto" value={formData.assunto} onChange={handleInputChange} required />
                  <Textarea name="mensagem" placeholder="Sua Mensagem" value={formData.mensagem} onChange={handleInputChange} rows="5" required />
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Enviar Mensagem
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </section>

        {/* ===================== FOOTER (COPIADO DO 404) ===================== */}
        <footer className="bg-gray-900 text-white py-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Getscale Soluções em Sistemas Embarcados. Todos os direitos reservados.</p>
        </footer>

        {/* ===================== WHATSAPP (COPIADO DO 404) ===================== */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center group"
          aria-label="Fale Conosco pelo WhatsApp"
        >
          <MessageCircle className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:rotate-6" />
        </a>
      </div>
  );
}


export default Suntech340h3;
import React, { useState, Suspense, lazy } from 'react';
import { Power, Zap, Terminal, Lock, Key, Users, List, AlertTriangle, Menu, X, Phone, Mail, MapPin, Cpu, Download, Repeat, MessageCircle, Pin } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Logo from './assets/logo.png';




const whatsappNumber = '5541991676700';
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

// ======================================================
// =============== COMPONENTE PRINCIPAL =================
// ======================================================
function Entrack404() {
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
    const endpoint = "/api/send-email";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* ===================== HEADER ===================== */}
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

      {/* ===================== SEÇÃO SUPORTE ===================== */}
      <section id="suporte" className="py-10 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 font-inter">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 border-b pb-3 mb-6">
              📌 GS-404 / GS-100 / GS-501 com Entrack
            </h1>

            <p>
              Esta página contém as integrações dos dispositivos GS-404 e GS-100 com os modelos da marca Entrack. Acesse abaixo o modelo desejado para instruções completas de instalação e configuração.
            </p>

            <br />

            <h2 className="text-2xl font-bold mb-4">🚗 Modelos compatíveis</h2>

            <p className="text-gray-600 mb-2">
              • <Link to= '/entrack-404/vl300r' // <<< Este é o caminho correto para o seu Link
                className="text-lg text-blue-600 underline"> VL300R📍</Link>
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Instruções específicas para instalação física e configuração do rastreador Entrack VL300R com os dispositivos <br></br>GS-404, GS-100 e GS-501.
            </p>
          </div>

          {/* Comunicação RS232 */}
          <div className="mt-16">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">
                  Comunicação RS232: Configuração Padrão
                </CardTitle>
                <CardDescription className="text-lg">
                  Instruções rápidas para a integração de periféricos.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold mb-2 text-lg">1. Alimentação</h4>
                  <p className="text-gray-600">O acessório e o rastreador devem ter o GND/Negativo interligados.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold mb-2 text-lg">2. Ligação (Invertida)</h4>
                  <p className="text-gray-600">Inverter RX e TX: TX do acessório no RX do rastreador e RX do acessório no TX do rastreador.</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold mb-2 text-lg">3. Configuração</h4>
                  <p className="text-gray-600">Configurar porta RS232 do rastreador para 19200 Bps.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===================== SEÇÃO CONTATO ===================== */}
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

      {/* ===================== FOOTER ===================== */}
      <footer className="bg-gray-900 text-white py-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Getscale Soluções em Sistemas Embarcados. Todos os direitos reservados.</p>
      </footer>

      {/* ===================== WHATSAPP ===================== */}
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


export default Entrack404;


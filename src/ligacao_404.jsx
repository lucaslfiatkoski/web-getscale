import React, { useState, useCallback } from 'react';
// Importação dos componentes de UI (Tailwind/Shadcn) - MANTENHA ESTES!
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Link } from "react-router-dom";
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Cpu, 
  Download, 
  Key,
  Repeat,
  MessageCircle
} from 'lucide-react';
import El404 from './assets/GS-404_14.jpg'
import Rele from './assets/rele.jpg'
import El100 from './assets/GS-100_13.jpg'
import El501_2 from './assets/GS-501_2.JPG'
import Logo from './assets/logo.png'

const whatsappNumber = '5541991676700'; // Formato internacional sem caracteres especiais
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;


function Ligacao_404() {
   const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [formData, setFormData] = useState({
      nome: '',
      email: '',
      telefone: '',
      assunto: '',
      mensagem: ''
    })
  
    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
  
    const handleSubmit = async (e) => {
    e.preventDefault();
    // ... adicione seu estado de loading aqui se desejar
    
    // O endpoint é o caminho para o arquivo que você criou: /api/send-email
    const endpoint = "/api/send-email";
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
      });
  
      if (response.ok) {
        alert('Mensagem enviada com sucesso!');
        // Limpar o formulário
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
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-30">
            <div className="flex items-center space-x-2">
              
              <div>
                <img 
                  src={Logo}
                  alt="Getscale Logo" 
                  className="h-20 object-contain"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {['home', 'contato'].map((id) => {
                if (id === 'home') {
                  return (
                    <Link 
                      key={id}
                      to="/"
                      className="text-gray-700 hover:text-blue-600 transition-colors font-medium capitalize"
                    >
                      {id}
                    </Link>
                  );
                }
                
                
                return (
                  <button 
                    key={id}
                    onClick={() => scrollToSection(id)} 
                    className="text-gray-700 hover:text-blue-600 transition-colors font-medium capitalize"
                  >
                    {id}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <nav className="md:hidden container mx-auto px-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-3">
              {['home', 'contato'].map((id) => {
                if (id === 'home') {
                  return (
                    <Link 
                      key={id}
                      to="/" 
                      className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium capitalize"
                      onClick={() => setIsMenuOpen(false)} 
                    >
                      {id}
                    </Link>
                  );
                }

                return (
                  <button 
                    key={id}
                    onClick={() => scrollToSection(id)} 
                    className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium capitalize"
                  >
                    {id}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      

      {/* Suporte Section (Inclui os Conversores) */}
      <section id="suporte" className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4 text-sm px-3 py-1">
              Ferramentas de Suporte
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Esquema de Ligação GS-404, GS-100 e GS-501
            </h2>
            <div className="flex justify-center mb-20"> 
              <img 
              src={El404} 
              alt="Exemplo de Cartão RFID ID A" 
              className="flex mx-auto h-auto w-auto "
              />
            </div>
          </div>
          <div className="text-center mb-10">
            <div className="flex justify-center mb-16"> 
              <img 
              src={El100} 
              alt="Exemplo de Cartão RFID ID A" 
              className="flex mx-auto h-auto w-auto "
              />
            </div>
          </div>
          <div className="text-center mb-10">
            <div className="flex justify-center mb-16"> 
              <img 
              src={El501_2} 
              alt="Exemplo de Cartão RFID ID A" 
              className="flex mx-auto h-auto w-auto "
              />
            </div>
          </div>
          <div className="text-center mb-10">
            <div className="flex justify-center mb-16"> 
              <img 
              src={Rele} 
              alt="Exemplo de Cartão RFID ID A" 
              className="flex mx-auto h-auto w-auto "
              />
            </div>
          </div>



          {/* Comunicação RS232 e Wiki Link */}
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
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h4 className="font-semibold mb-2 text-lg">1. Alimentação</h4>
                    <p className="text-base text-gray-600">O acessório e o rastreador devem ter o GND/Negativo interligados ou compartilhar a mesma fonte.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h4 className="font-semibold mb-2 text-lg">2. Ligação (Invertida)</h4>
                    <p className="text-sm text-gray-600">
                      Inverter RX e TX: TX do acessório no RX do rastreador 
                      e RX do acessório no TX do rastreador.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    
                    <h4 className="font-semibold mb-2">3. Configuração</h4>
                    <p className="text-sm text-gray-600">
                      Configurar porta RS232 do rastreador para 19200 Bps.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </section>

      {/* Contato Section */}
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
              <h3 className="text-2xl font-semibold mb-4 border-b border-blue-700 pb-2">Nossos Canais</h3>
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
                  <p className="text-gray-300 text-lg">Rua T. Cel. Carlos Souza , 104 - Centro - São João do Triunfo, PR</p>
                </div>
              </div>
            </div>

            {/* Formulário de Contato */}
            <Card className="bg-white p-6 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  name="nome"
                  placeholder="Seu Nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Seu E-mail"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="tel"
                  name="telefone"
                  placeholder="Telefone (Opcional)"
                  value={formData.telefone}
                  onChange={handleInputChange}
                />
                <Input
                  type="text"
                  name="assunto"
                  placeholder="Assunto"
                  value={formData.assunto}
                  onChange={handleInputChange}
                  required
                />
                <Textarea
                  name="mensagem"
                  placeholder="Sua Mensagem"
                  value={formData.mensagem}
                  onChange={handleInputChange}
                  rows="5"
                  required
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Enviar Mensagem
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Getscale Soluções em Sistemas Embarcados. Todos os direitos reservados.</p>
        </div>
      </footer>
      <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer group"
          aria-label="Fale Conosco pelo WhatsApp"
      >
          <MessageCircle className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:rotate-6" />
      </a>
    </div>
  );
}

export default Ligacao_404;
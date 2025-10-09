import React, { useState }  from 'react'
import { lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Cpu, 
  Wifi, 
  Shield, 
  Settings, 
  Download,
  ChevronRight,
  Star,
  CheckCircle,
  MessageSquare,
  MessageCircle,
  Link2
  
} from 'lucide-react'
import './App.css'
import { Link, Routes, Route, BrowserRouter } from "react-router-dom";
import ScrollToTop from './ScrollToTop.jsx';




const RFIDConverter = lazy(() => import('./conversor_id_a.jsx'));
const HexStringToBytes = lazy(() => import('./conversor_1wire.jsx'));
const AcessorioConverter = lazy(() => import('./onewire_ibutton.jsx'));
const SMSCommandGenerator = lazy(() => import('./sms_suntech.jsx'));
const ATCommandGenerator = lazy(() => import('./sms_queclink.jsx'));
const CardAdditionCommandGenerator = lazy(() => import('./cadatro_cartao.jsx'));
const CardRegistrationCommandGenerator = lazy(() => import('./protocolo_404.jsx'));
const Command401Details = lazy(() => import('./protocolo_302.jsx'));
const Command801Details = lazy(() => import('./protocolo_601.jsx'));
const Ligacao_404 = lazy(() => import('./ligacao_404.jsx'));
const Ligacao_601 = lazy(() => import('./ligacao_601.jsx'));
const Ligacao_302 = lazy(() => import('./ligacao_302.jsx'));
const Manual_501 = lazy(() => import('./manual_501.jsx'));
const ManualGs404 = lazy(() => import('./manual_404.jsx'));
const ManualGs601 = lazy(() => import('./manual_601.jsx'));





// Import das imagens
import techBg from './assets/ckyaCOQezIV6.jpg'
import embeddedSystems from './assets/GS404.jpg'
import Gs100 from './assets/GS100.jpg'
import Gs301 from './assets/GS301.jpg'
import Gs302 from './assets//GS302.jpg'
import Gs601 from './assets/GS601.jpg'
import Gs501 from './assets/GS501.png'
import Logo from './assets/logo.png'





function Home() {
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
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const whatsappNumber = '5541991676700'; // Formato internacional sem caracteres especiais
  const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico sobre produtos e ligações.';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div >
                <img 
                src={Logo}  
                alt="Getscale Logo" 
                className="w-80 h-40 object-contain"
                />    
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection('servicos')} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Serviços
              </button>
              <button onClick={() => scrollToSection('produtos')} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Produtos
              </button>
              <button onClick={() => scrollToSection('suporte')} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Suporte
              </button>
              <button onClick={() => scrollToSection('contato')} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Contato
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col space-y-3">
                <button onClick={() => scrollToSection('home')} className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Home
                </button>
                <button onClick={() => scrollToSection('servicos')} className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Serviços
                </button>
                <button onClick={() => scrollToSection('produtos')} className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Produtos
                </button>
                <button onClick={() => scrollToSection('suporte')} className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Suporte
                </button>
                <button onClick={() => scrollToSection('contato')} className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  Contato
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${techBg})` }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Identificador de 
                  <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    {' '}Motorista e Passageiros
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Soluções embarcadas personalizadas para identificação por RFID, 
                  sensores de temperatura e sistemas de controle para veículos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3"
                  onClick={() => scrollToSection('produtos')}
                >
                  Ver Produtos
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
                  onClick={() => scrollToSection('contato')}
                >
                  Entre em Contato
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">Até 10cm</div>
                  <div className="text-sm text-gray-600">Alcance de Leitura</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">Até 1.500</div>
                  <div className="text-sm text-gray-600">Cadastros</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1 ano</div>
                  <div className="text-sm text-gray-600">Garantia</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">Dupla Frêquencia</div>
                  <div className="text-sm text-gray-600">125KHz e 13.56MHz</div>
                </div>
                
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-2 shadow-2xl">
                <img 
                  src={embeddedSystems} 
                  alt="Sistema Embarcado GS-404" 
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      

      {/* Serviços Section */}
      <section id="servicos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-4">
              Nossos Serviços
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Desenvolvimento de Soluções Personalizadas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A Getscale é uma empresa focada em desenvolvimento de novos produtos. 
              Nosso grande diferencial é a capacidade de personalização dos produtos 
              e desenvolvimento de novas soluções sob medida.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Wifi className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">RFID</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Identificadores de motorista e passageiros com tecnologia RFID avançada
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Sensores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Sensores de temperatura e umidade.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Controle</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Teclados para jornada de trabalho e sistemas de controle de bloqueio
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Personalização</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Desenvolvimento de soluções sob medida para cada necessidade
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-700 mb-6">
              Entre em contato com nossa equipe. Estamos preparados para desenvolver 
              a solução na medida da sua necessidade.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              onClick={() => scrollToSection('contato')}
            >
              Solicitar Orçamento
            </Button>
          </div>
        </div>
      </section>

      {/* Produtos Section */}
      <section id="produtos" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mb-4">
              Nossos Produtos
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Tecnologia RFID Avançada
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="h-10 w-30 bg-green-100 text-green-800">Destaque</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src={embeddedSystems} 
                    alt="Tecnologia RFID" 
                    className="w-auto h-auto object-cover rounded-lg"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Leitura até 10 cm</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">100 cadastros</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Buzzer embutido</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Protocolo Configurável</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Dupla frequência</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">1 ano garantia</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">
                Especificações Técnicas
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Comunicação</h4>
                  <p className="text-gray-600">
                    Protocolo configurável com versões RS232, TTL, OneWire etc..
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">RFID</h4>
                  <p className="text-gray-600">
                    Leitor dupla frequência: 125Khz EM4100 e 13.56Mhz Mifare
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Recursos</h4>
                  <p className="text-gray-600">
                    Controle de relé para bloqueio, opcão de proteção IP67, 
                    modo baixo consumo para motocicletas
                  </p>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                onClick={() => scrollToSection('contato')}
              >
                Solicitar Informações
              </Button>
            </div>
            <div>
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="h-10 w-30 bg-green-100 text-green-800">Destaque</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src={Gs601} 
                    alt="Tecnologia RFID" 
                    className="w-auto h-auto object-cover rounded-lg"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Leitura até 10 cm</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Dupla frequência</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Botões macro</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Protocolo Configurável</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Controle de jornada</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">1 ano garantia</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">
                Especificações Técnicas
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Comunicação</h4>
                  <p className="text-gray-600">
                    Protocolo configurável com versões RS232 e TTL.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">RFID</h4>
                  <p className="text-gray-600">
                    Leitor dupla frequência: 125Khz EM4100 e 13.56Mhz Mifare
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Funcionalidades</h4>
                  <p className="text-gray-600">
                    Controle de jornada de trabalho, botões macro programáveis, trava baú, identificação de passageiros ou ajudante,
                    memoria para até 100 cartões.
                  </p>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                onClick={() => scrollToSection('contato')}
              >
                Solicitar Informações
              </Button>
            </div>
            <div>
              <Card className="border-0 shadow-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="h-10 w-30 bg-green-100 text-green-800">Novo</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img 
                    src={Gs501} 
                    alt="Tecnologia RFID" 
                    className="w-auto h-auto object-cover rounded-lg"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Identificação por senhas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Até 100 cadastros</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Botões macro</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Protocolo Configurável</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Buzzer embutido</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">1 ano garantia</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">
                Especificações Técnicas
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Comunicação</h4>
                  <p className="text-gray-600">
                    Protocolo configurável com versões RS232, TTL e OneWire.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">identificação</h4>
                  <p className="text-gray-600">
                    Identificação por senhas via teclado matricial 3x4, opcional Leitor dupla frequência: 125Khz EM4100 e 13.56Mhz Mifare.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Recursos</h4>
                  <p className="text-gray-600">
                    Identificação de motorista e passageiros via senha, opção de IP67, Opção de identificação via cartão,
                    Memoria para até 100 cartões, controle de relé para bloqueio.
                  </p>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                onClick={() => scrollToSection('contato')}
              >
                Solicitar Informações
              </Button>
            </div> 
          
            <div>
              <Card className="border-0 shadow-2xl">
                <CardContent className="space-y-4">
                  <img 
                    src={Gs100} 
                    alt="Tecnologia RFID" 
                    className="w-auto h-auto object-cover rounded-lg"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Compatível com chaveiros DS1990A</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">100 cadastros</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Buzzer embutido</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Protocolo Configurável</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">1 ano garantia</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">
                Especificações Técnicas
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Comunicação</h4>
                  <p className="text-gray-600">
                    Protocolo configurável com versões RS232, TTL, OneWire etc..
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">RFID</h4>
                  <p className="text-gray-600">
                    Leitor Ibutton compatível com chaveiros DS1990A
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Recursos</h4>
                  <p className="text-gray-600">
                    Controle de relé para bloqueio, opção de proteção IP67,
                    modo baixo consumo para motocicletas
                  </p>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                onClick={() => scrollToSection('contato')}
              >
                Solicitar Informações
              </Button>
            </div>         
          
            <div>
              <Card className="border-0 shadow-2xl">
                <CardContent className="space-y-4">
                  <img 
                    src={Gs301} 
                    alt="Tecnologia RFID" 
                    className="w-auto h-auto object-cover rounded-lg"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Suporta 1 sensor de temperatura</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">faixa de medição: -40° a 130°C</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">1°C de precisão</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Protocolo Configurável</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Alerta temperatura maxima e minima excedida</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">1 ano garantia</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">
                Especificações Técnicas
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Comunicação</h4>
                  <p className="text-gray-600">
                    Protocolo configurável com versões RS232 e TTL.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Temperatura</h4>
                  <p className="text-gray-600">
                    Faixa de medição: -40° a 130°C com 1°C de precisão
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Recursos</h4>
                  <p className="text-gray-600">
                    Controle de relé para bloqueio, Leitor RFID opcional para leitura de motorista e/ou passageiros.
                  </p>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                onClick={() => scrollToSection('contato')}
              >
                Solicitar Informações
              </Button>
            </div>

            <div>
              <Card className="border-0 shadow-2xl">
                <CardContent className="space-y-4">
                  <img 
                    src={Gs302} 
                    alt="Tecnologia RFID" 
                    className="w-auto h-auto object-cover rounded-lg"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Suporta 3 sensores de temperatura</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">faixa de medição: -40° a 130°C</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">1°C de precisão</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Protocolo Configurável</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">Alerta temperatura maxima e minima excedida</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm">1 ano garantia</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">
                Especificações Técnicas
              </h3>
              
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Comunicação</h4>
                  <p className="text-gray-600">
                    Protocolo configurável com versões RS232 e TTL.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Temperatura</h4>
                  <p className="text-gray-600">
                    Faixa de medição: -40° a 130°C com 1°C de precisão
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Recursos</h4>
                  <p className="text-gray-600">
                    Opção com sensor de umidade, sensores de temperatura adicionais.
                  </p>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                onClick={() => scrollToSection('contato')}
              >
                Solicitar Informações
              </Button>
            </div>
          </div>
        </div>
      </section>
      
    

      {/* Suporte Section */}
      <section id="suporte" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4">
              Suporte Técnico
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-10">
              Manuais, Documentações e Configuradores
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="justify-center w-full hover:shadow-xl transition-shadow border-0 shadow-lg ">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Link2 className="w-5 h-5 text-blue-600" />
                    <span>Manuais</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">
                      • <Link 
                              to="/manual-404" 
                              className="text-blue-600 hover:underline"
                          >
                              Manual GS-404
                          </Link>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      • <Link 
                              to="/manual-501" 
                              className="text-blue-600 hover:underline"
                          >
                              Manual GS-501
                          </Link>
                    </p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-600">
                          • <Link 
                              to="/manual-601" 
                              className="text-blue-600 hover:underline"
                          >
                              Manual GS-601
                          </Link>
                      </p>
                  </div>
                </CardContent>
              </Card>
            <Card className="hover:shadow-xl transition-shadow border-0 shadow-lg ">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link2 className="w-5 h-5 text-green-600" />
                  <span>Protocolos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">
                    • <Link 
                              to="/protocolo-404" 
                              className="text-blue-600 hover:underline"
                          >
                              Protocolo GS-404, GS-100 e GS-501
                          </Link>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    • <Link 
                              to="/protocolo-601" 
                              className="text-blue-600 hover:underline"
                          >
                              Protocolo GS-601
                          </Link>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    • <Link 
                              to="/protocolo-302" 
                              className="text-blue-600 hover:underline"
                          >
                              Protocolo GS-302
                          </Link>
                  </p>
                </div>
                
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow border-0 shadow-lg ">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="w-5 h-5 text-purple-600" />
                  <span>Configuradores</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">
                    • <a 
                        href="/GS404_GS100_GS501_Configurador_1_21.zip" // Mude para o caminho real do arquivo
                        download="GS404_GS100_GS501_Configurador_1_21.zip" // Adiciona o atributo 'download' e sugere um nome para o arquivo
                        className="text-blue-600 hover:underline"
                      >
                        Configurador GS-404, GS-100 e GS-501
                      </a>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    • <a 
                        href="/GS_601_Configurador_1_1.zip" // Mude para o caminho real do arquivo
                        download="GS_601_Configurador_1_1.zip" // Adiciona o atributo 'download' e sugere um nome para o arquivo
                        className="text-blue-600 hover:underline"
                      >
                        Configurador GS-601
                      </a>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    • <a 
                        href="/GS-302_Configurador_0_5.zip" // Mude para o caminho real do arquivo
                        download="GS-302_Configurador_0_5.zip" // Adiciona o atributo 'download' e sugere um nome para o arquivo
                        className="text-blue-600 hover:underline"
                      >
                        Configurador GS-302
                      </a>
                  </p>
                </div>
                
              </CardContent>
            </Card>
            

          </div>
          <br></br>  <br></br>  <br></br>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Esquemas de ligações e configurações com rastreadores
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {/* GS-404 Manuais */}
            <Card className="hover:shadow-xl transition-shadow border-0 shadow-lg ">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link2 className="w-5 h-5 text-blue-600" />
                  <span>GS-404 / GS-100 / GS-501</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    • <a 
                        href="http://wiki.getscale.com.br/pt-br/gs404_entrack" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GS-404 / GS-100 / GS-501 com Entrack
                      </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    • <a 
                        href="http://wiki.getscale.com.br/pt-br/gs404getrak" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GS-404 / GS-100 / GS-501 com Getrak
                      </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    • <a 
                        href="http://wiki.getscale.com.br/pt-br/gs404jimi" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GS-404 / GS-100 / GS-501 com Jimi
                      </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    • <a 
                        href="http://wiki.getscale.com.br/pt-br/gs404multiportal" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GS-404 / GS-100 / GS-501 com Multiportal
                      </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    • <a 
                        href="http://wiki.getscale.com.br/pt-br/gs404queclink" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GS-404 / GS-100 / GS-501 com Queclink
                      </a>
                  </p>

                  <p className="text-sm text-gray-600">
                    • <a 
                        href="http://wiki.getscale.com.br/pt-br/gs404quanta" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GS-404 / GS-100 / GS-501 com Quanta
                      </a>
                  </p>

                  <p className="text-sm text-gray-600">
                    • <a 
                        href="http://wiki.getscale.com.br/pt-br/gs404reptela" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GS-404 / GS-100 / GS-501 com Ruptela
                      </a>
                  </p>

                  <p className="text-sm text-gray-600">
                    • <a 
                        href="http://wiki.getscale.com.br/pt-br/gs404suntech" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GS-404 / GS-100 / GS-501 com Suntech
                      </a>
                  </p>

                  <p className="text-sm text-gray-600">
                    • <a 
                        href="http://wiki.getscale.com.br/pt-br/gs404teltonika" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GS-404 / GS-100 / GS-501 com Teltonika
                      </a>
                  </p>

                  <p className="text-sm text-gray-600">
                    • <a 
                        href="http://wiki.getscale.com.br/pt-br/gs404vitana" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GS-404 / GS-100 / GS-501 com Vitana
                      </a>
                  </p>
                  </div>
                  <div>
                  <p className="text-sm text-gray-600">
                    • <Link 
                        to="/ligacao_404" 
                        className="text-blue-600 hover:underline" 
                     
                      >
                        Esquema de Ligação
                      </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* GS-601 Manuais */}
            <Card className="hover:shadow-xl transition-shadow border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link2 className="w-5 h-5 text-green-600" />
                  <span>GS-601</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    • <a 
                        href="http://wiki.getscale.com.br/pt-br/gs601multiportal" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GS-601 com Multiportal
                      </a>
                  </p>
                  <p className="text-sm text-gray-600">
                    • <a 
                        href="http://wiki.getscale.com.br/pt-br/gs601suntech" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GS-601 com Suntech
                      </a>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    • <Link 
                        to="/ligacao_601" 
                        className="text-blue-600 hover:underline" 
                       
                      >
                        Esquema de Ligação
                      </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* GS-302 Manuais */}
            <Card className="hover:shadow-xl transition-shadow border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link2 className="w-5 h-5 text-purple-600" />
                  <span>GS-302</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    
                    • <a 
                        href="http://wiki.getscale.com.br/pt-br/gs302suntech" 
                        className="text-blue-600 hover:underline" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        GS-302 com Suntech
                      </a>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    • <Link 
                        to="/ligacao_302" 
                        className="text-blue-600 hover:underline" 
                      >
                        Esquema de Ligação
                      </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <br></br>  <br></br>  <br></br>
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Geradores de comandos e Conversores de cartões
            </h2>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>

            <Card className="hover:shadow-xl transition-shadow border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link2 className="w-5 h-5 text-blue-600" />
                  <span>Conversor para cartões RFID</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">
                     <Link
                        to="/conversor-id-a" 
                        className="text-blue-600 hover:underline" 
                  
                      >
                        Conversor ID A e W
                      </Link>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                     <Link 
                        to="/conversor-id-onewire" 
                        className="text-blue-600 hover:underline" 
                        
                      >
                        Conversor ID decimal para 1-wire
                      </Link>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                     <Link 
                        to="/conversor-onewire-ibutton" 
                        className="text-blue-600 hover:underline" 
                      >
                        Inversor OneWire para Ibutton.
                      </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link2 className="w-5 h-5 text-green-600" />
                  <span>Gerador de Comandos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">
                      <Link 
                        to="/gerador-sms-suntech" 
                        className="text-blue-600 hover:underline" 
                      >
                        Gerador de SMS para rastreadores Suntech
                      </Link>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                      <Link 
                              to="/gerador-sms-queclink" 
                              className="text-blue-600 hover:underline"
                          >
                              Gerador de SMS para rastreadores Queclink
                          </Link>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                      <Link 
                              to="/cadastro_cartao" 
                              className="text-blue-600 hover:underline"
                          >
                              Comando RS232 para Adição de Cartões
                          </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>



          


          {/* Comunicação RS232 */}
          <div className="mt-16">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-800">
                  Comunicação RS232
                </CardTitle>
                <CardDescription className="text-lg">
                  Instruções para configuração correta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700">
                  Para a comunicação RS232 funcionar corretamente, você precisa verificar três itens:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-blue-600">1</span>
                    </div>
                    <h4 className="font-semibold mb-2">Alimentação</h4>
                    <p className="text-sm text-gray-600">
                      O acessório deve ser energizado com a mesma fonte do rastreador, 
                      ou interligar os GND/Negativos.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-green-600">2</span>
                    </div>
                    <h4 className="font-semibold mb-2">Ligação</h4>
                    <p className="text-sm text-gray-600">
                      Inverter RX e TX: TX do acessório no RX do rastreador 
                      e RX do acessório no TX do rastreador.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-purple-600">3</span>
                    </div>
                    <h4 className="font-semibold mb-2">Configuração</h4>
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
          <div className="text-center mb-16">
            <Badge className="bg-white/20 text-white hover:bg-white/30 mb-4">
              Entre em Contato
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Vamos Desenvolver Sua Solução
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Estamos preparados para desenvolver a solução na medida da sua necessidade
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulário */}
            <Card className="border-0 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">
                  Envie sua Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="nome"
                        placeholder="Nome *"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email *"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        name="telefone"
                        placeholder="Telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Input
                        name="assunto"
                        placeholder="Assunto"
                        value={formData.assunto}
                        onChange={handleInputChange}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <Textarea
                    name="mensagem"
                    placeholder="Sua mensagem..."
                    value={formData.mensagem}
                    onChange={handleInputChange}
                    rows={5}
                    className="resize-none"
                  />

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12"
                  >
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Onde Estamos</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Endereço</h4>
                      <p className="text-blue-100">
                        Rua T. Cel. Carlos Souza 104<br />
                        Centro, São João do Triunfo - PR<br />
                        CEP: 84150-000, Brasil
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Telefone</h4>
                      <p className="text-blue-100">
                        0800 191 2328<br />
                        <span className="text-sm">Horário: 08h ~ 12h, 13h ~ 17h</span>
                      </p>
                      <p className="text-blue-100 mt-2">
                        WhatsApp: (+55 41) 9 9167-6700
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-blue-100">
                        contato@getscale.com.br
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h4 className="font-semibold mb-3">Horário de Atendimento</h4>
                <div className="space-y-2 text-blue-100">
                  <p>Segunda a Sexta: 08:00 - 12:00, 13:00 - 17:00</p>
                  <p>Sábado e Domingo: Fechado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Getscale</span>
            </div>
            <p className="text-gray-400 mb-4">
              Sistemas Embarcados - Soluções Personalizadas
            </p>
            <p className="text-sm text-gray-500">
              © Copyright 2025 Getscale - Sistemas Embarcados - Todos os direitos reservados
            </p>
          </div>
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
  )
}

function App() {
  return ( 
    <>
      <ScrollToTop />
      <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Carregando a Página...</div>}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conversor-id-a" element={<RFIDConverter />} />
        <Route path="/conversor-id-onewire" element={<HexStringToBytes />} />
        <Route path="/conversor-onewire-ibutton" element={<AcessorioConverter />} />
        <Route path="/gerador-sms-suntech" element={<SMSCommandGenerator />} />
        <Route path="/gerador-sms-queclink" element={<ATCommandGenerator />} />
        <Route path="/cadastro_cartao" element={<CardAdditionCommandGenerator />} />
        <Route path="/protocolo-404" element={<CardRegistrationCommandGenerator />} />
        <Route path="/protocolo-302" element={<Command401Details />} />
        <Route path="/protocolo-601" element={<Command801Details />} />
        <Route path="/ligacao_404" element={<Ligacao_404 />} />
        <Route path="/ligacao_601" element={<Ligacao_601 />} />
        <Route path="/ligacao_302" element={<Ligacao_302 />} />
        <Route path="/manual-501" element={<Manual_501 />} />
        <Route path="/manual-404" element={<ManualGs404 />} />
        <Route path="/manual-601" element={<ManualGs601 />} />
          
        </Routes>
      </Suspense>
    </>
   
  );
}
export default App;

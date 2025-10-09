import React, { useState, useCallback } from 'react';
import { Power, Zap, Terminal, Lock, Key, Users, List, AlertTriangle, Menu, X, Phone, Mail, MapPin, Cpu, Download, Repeat,  MessageCircle } from 'lucide-react';
// Importação dos componentes de UI (Tailwind/Shadcn) - MANTENHA ESTES!
// Nota: Assumimos que estas importações estão disponíveis no seu ambiente.
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Link } from "react-router-dom";
import Rele from './assets/rele.jpg'
import Gs404 from './assets/GS404.jpg'
import CardRegistrationCommandGenerator from './protocolo_404'
import Logo from './assets/logo.png'

// --- DADOS E COMPONENTES AUXILIARES DO MANUAL ---
const whatsappNumber = '5541991676700'; // Formato internacional sem caracteres especiais
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico sobre produtos e ligações.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

// Dados para a Tabela de Conexões
const conexoesGs501 = [
  { fio: '1', cor: 'Vermelho', funcao: 'Positivo (Alimentação 12V/24V)', corClass: 'bg-red-500 text-white' },
  { fio: '2', cor: 'Marrom', funcao: 'GND/Terra/Negativo', corClass: 'bg-yellow-700 text-white' },
  { fio: '3', cor: 'Azul', funcao: 'Positivo Pós-Chave (Sinal de Ignição)', corClass: 'bg-blue-600 text-white' },
  { fio: '4', cor: 'Laranja', funcao: 'Comunicação RS232/TTL (Rx)', corClass: 'bg-orange-500 text-white' },
  { fio: '5', cor: 'Verde', funcao: 'Comunicação RS232/TTL (Tx)', corClass: 'bg-green-600 text-white' },
  { fio: '6', cor: 'Amarelo', funcao: 'Saída de Bloqueio (Sinal Negativo)', corClass: 'bg-yellow-400 text-gray-800' },
  { fio: '7', cor: 'Cinza', funcao: 'One-Wire (Comunicação com periféricos)', corClass: 'bg-gray-500 text-white' },
];

// Componente para Tabela de Conexões
const ConnectionTable = ({ data }) => (
  <div className="overflow-x-auto rounded-lg shadow-md mt-4">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">Fio</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/12">Cor</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8/12">Função</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item, index) => (
          <tr key={index} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.fio}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm">
              <span className={`inline-block w-full text-center py-1 rounded-full text-xs font-semibold ${item.corClass}`}>
                {item.cor}
              </span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">{item.funcao}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <p className="p-3 text-xs text-gray-500 bg-gray-100 rounded-b-lg">
      <Terminal className="inline w-3 h-3 mr-1 align-sub" />
      Taxa de transmissão padrão: **19200bps**
    </p>
  </div>
);

// Componente para Tabela de Comandos
const CommandTable = ({ title, data }) => (
  <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200 shadow-inner">
    <h4 className="text-base font-semibold text-purple-800 mb-3 flex items-center">
      <List className="w-4 h-4 mr-2" />
      {title}
    </h4>
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-start bg-white p-3 rounded-lg shadow-sm">
          <code className="flex-shrink-0 font-mono text-sm font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded mr-4">
            {item.comando}
          </code>
          <p className="text-sm text-gray-700">{item.descricao}</p>
        </div>
      ))}
    </div>
  </div>
);

// Componente para Bloco de Alerta
const AlertBlock = ({ children, title, type = 'warning' }) => {
  const styles = {
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800',
  };
  const Icon = type === 'warning' ? AlertTriangle : List;

  return (
    <blockquote className={`border-l-4 p-4 rounded-r-lg shadow-md ${styles[type]} my-6`}>
      <p className="font-bold flex items-center mb-1">
        <Icon className="w-5 h-5 mr-2" />
        {title}
      </p>
      <div className="text-sm">{children}</div>
    </blockquote>
  );
};

// --- COMPONENTE PRINCIPAL (App Shell) ---

function ManualGs404() {
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
  
  // O conteúdo original do manual foi movido para a seção #suporte

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-30">
            <div className="flex items-center space-x-2">
              <div>
                {/* Imagem Placeholder para logo */}
                <img 
                  src={Logo}
                  alt="Getscale Logo" 
                  className="h-20 object-contain"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {['contato'].map((id) => {
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
              {/* Adicionando link da Home para o fluxo de navegação */}
              <Link 
                  to="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium capitalize"
                >
                  Home
              </Link>
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
              {[ 'contato'].map((id) => {
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
              <Link 
                  to="/"
                  className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium capitalize"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Suporte Section (Inclui o Manual Técnico) */}
      <section id="suporte" className="py-10 bg-white">
        <div className="container mx-auto px-4">

          {/* Conteúdo do Manual Técnico GS-501 (Conteúdo Original Preservado) */}
          <div className="max-w-4xl mx-auto p-4 sm:p-8 bg-white shadow-xl rounded-2xl font-inter">

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 border-b pb-3 mb-6">
              Manual Técnico – GS-404
            </h1>

            {/* Seção 1: Esquema Elétrico */}
            <div>
                <img 
                src={Gs404} 
                className="flex mx-auto h-auto w-auto "
                />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4 mt-6">
              <Zap className="w-6 h-6 mr-3 text-indigo-600" />
              1. Esquema Elétrico
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              A correta instalação do GS-404 é fundamental para seu perfeito funcionamento. Siga atentamente o diagrama de ligação abaixo.
            </p>

            <h3 className="text-xl font-semibold text-gray-700 mb-3 border-l-4 border-indigo-500 pl-3">
              1.1. Diagrama de Conexões
            </h3>
            <ConnectionTable data={conexoesGs501} />

            {/* Seção 1.2: Esquema Elétrico – Relé de Bloqueio */}
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-indigo-500 pl-3">
              1.2. Esquema Elétrico – Relé de Bloqueio
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Para a função de bloqueio, é obrigatório o uso de um relé (não incluso). A saída de bloqueio fio <strong>AMARELO</strong> emite um <strong>sinal negativo</strong> para acionar o relé, que por sua vez interrompe um circuito vital do veículo (ex: bomba de combustível, motor de partida).
            </p>
            
            <AlertBlock title="Atenção" type="warning">
              Deve-se usar sempre um relé com <strong>diodo de proteção</strong> para evitar danos elétricos ao equipamento e ao veículo.
            </AlertBlock>
            
            <div className="bg-gray-100 p-4 rounded-lg text-center text-sm text-gray-600 border border-gray-200">
              <img 
                src={Rele} 
                className="flex mx-auto h-auto w-auto "
                />
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Seção 2: Funcionamento e Configurações */}
            <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4">
              <Key className="w-6 h-6 mr-3 text-green-600" />
              2. Funcionamento e Configurações
            </h2>

            {/* 2.1. Funcionamento – Identificação de Motorista */}
            <h3 className="text-xl font-semibold text-gray-700 mb-3 border-l-4 border-green-500 pl-3">
              2.1. Funcionamento – Identificação de Motorista
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Com o equipamento corretamente instalado, ao reconhecer a tentativa de ligar 
            o veículo (sinal positivo no fio azul do pós-chave), o GS-404 aciona o bloqueio e começa 
            a emitir um alerta sonoro, informando ao motorista que deve se identificar. Para se 
            identificar, o motorista deve aproximar o cartão da leitora e aguardar 3 bipes curtos, 
            informando a leitura
            </p>
            
        
            <p className="text-gray-700 leading-relaxed mt-4">
              Com o motorista identificado, o bloqueio é liberado e a viagem pode ser iniciada. Ao desligar o veículo, um bipe longo é emitido quando o logout automático é executado, e o veículo é bloqueado novamente.
            </p>

            <CommandTable 
              title="Comandos de Configuração"
              data={[
                { comando: '719|1|', descricao: 'Ativa a identificação de motorista (padrão de fábrica).' },
                { comando: '719|0|', descricao: 'Desativa a identificação de motorista.' },
              ]}
            />

            {/* 2.2. Funcionamento – Identificação de Passageiros */}
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
              2.2. Funcionamento – Identificação de Passageiros
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              O GS-404 pode ser usado para registrar a entrada de passageiros. Uma vez ativa, com o veículo ligado, o leitor se mantém ativo e toda senha ou cartão apresentado será enviado ao sistema como uma identificação de passageiro.
            </p>
            <CommandTable 
              title="Comandos de Configuração"
              data={[
                { comando: '718|1|', descricao: 'Ativa a identificação de passageiros.' },
                { comando: '718|0|', descricao: 'Desativa a identificação de passageiros (padrão de fábrica).' },
              ]}
            />
            
            {/* 2.3. Configurações – Saída de Bloqueio */}
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
              2.3. Configurações – Saída de Bloqueio
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              A saída de bloqueio possui 4 modos de funcionamento:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><span className="font-bold">Qualquer Identificação (Padrão):</span> Qualquer senha ou cartão fará o desbloqueio.</li>
              <li><span className="font-bold">Lista Restrita:</span> Apenas senhas ou cartões cadastrados na lista interna farão o desbloqueio.</li>
              <li><span className="font-bold">Sempre Ativo:</span> Veículo bloqueado permanentemente até a configuração ser alterada.</li>
              <li><span className="font-bold">Sempre Desativado:</span> O bloqueio nunca será ativado.</li>
            </ul>

            <CommandTable 
              title="Comandos de Configuração do Bloqueio"
              data={[
                { comando: '703|2|', descricao: 'Qualquer senha/cartão fará o desbloqueio (padrão de fábrica).' },
                { comando: '703|1|', descricao: 'Apenas senhas/cartões cadastrados farão o desbloqueio.' },
                { comando: '703|3|', descricao: 'Sempre ativo (bloqueado).' },
                { comando: '703|0|', descricao: 'Sempre desativado.' },
              ]}
            />

            {/* 2.4. Configurações – Lista de Motoristas */}
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
              2.4. Configurações – Lista de Motoristas (Senhas e Cartões)
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              A lista de motoristas pode ser controlada pelos seguintes comandos:
            </p>
            <CommandTable 
              title="Comandos de Gerenciamento da Lista"
              data={[
                { comando: '701|Numero|', descricao: 'Adiciona uma senha (até 9 dígitos) ou cartão à lista.' },
                { comando: '702|Numero|', descricao: 'Remove uma senha ou cartão da lista.' },
                { comando: '704|0|', descricao: 'Consulta a quantidade de itens cadastrados na lista.' },
                { comando: '707|0|', descricao: 'Apaga **todos** os itens da lista.' },
                { comando: '708|Numero|', descricao: 'Consulta se uma senha ou cartão específico está na lista.' },
              ]}
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
              Para lista completa de comandos, acessar : 
            </h3>
            <p className="text-sm text-gray-600">
                • <a 
                href="./protocolo-404" 
                className="text-blue-600 hover:underline" 
                target="_blank" 
                rel="noopener noreferrer"
                >
                Protocolo GS-404, GS-100 e GS-501
                </a>
            </p>

          </div>

          {/* Comunicação RS232 e Wiki Link - Conteúdo novo do usuário */}
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
                    <p className="text-base text-gray-600">Inverter RX e TX: TX do acessório no RX do rastreador e vice-versa.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h4 className="font-semibold mb-2 text-lg">3. Configuração</h4>
                    <p className="text-base text-gray-600">Configurar o rastreador com taxa de transmissão padrão **19200 8N1**.</p>
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
function App() {
  return (
    <Routes>
      <Route path="/protocolo-404" element={<CardRegistrationCommandGenerator />} />
    </Routes>
  );
}

export default ManualGs404;




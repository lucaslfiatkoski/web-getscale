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
import Gs601 from './assets/GS601.jpg'
import CardRegistrationCommandGenerator from './protocolo_601'
import Ledjornada from './assets/ledjornada.png'
import Cartao from './assets/cartao601.png'
import led1 from './assets/led1.png'
import led2 from './assets/led2.png'
import led3 from './assets/led3.png'


// --- DADOS E COMPONENTES AUXILIARES DO MANUAL ---
const whatsappNumber = '5541991676700'; // Formato internacional sem caracteres especiais
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico sobre produtos e ligações.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

// Dados para a Tabela de Conexões
const conexoesGs501 = [
  { fio: '1', cor: 'Vermelho', funcao: 'Positivo (Alimentação 12V/24V)', corClass: 'bg-red-500 text-white' },
  { fio: '2', cor: 'Marrom', funcao: 'GND/Terra/Negativo', corClass: 'bg-yellow-700 text-white' },
  { fio: '3', cor: 'Azul', funcao: 'Positivo Pós-Chave (Sinal de Ignição)', corClass: 'bg-blue-600 text-white' },
  { fio: '4', cor: 'Roxo', funcao: 'Comunicação RS232/TTL (Rx)', corClass: 'bg-purple-500 text-white' },
  { fio: '5', cor: 'Cinza', funcao: 'Comunicação RS232/TTL (Tx)', corClass: 'bg-gray-600 text-white' },
  { fio: '6', cor: 'Amarelo', funcao: 'Saída de Bloqueio (Sinal Negativo)', corClass: 'bg-yellow-400 text-gray-800' },
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
  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-inner">
    <h4 className="text-base font-semibold text-blue-800 mb-3 flex items-center">
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

function ManualGs601() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Substituindo alert() por console.log() conforme as regras do ambiente
    console.log('Mensagem de contato enviada:', formData); 
    
    // Simulação de envio
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      assunto: '',
      mensagem: ''
    });
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
                  src="./logo.png" 
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
              Manual Técnico – GS-601
            </h1>

            {/* Seção 1: Esquema Elétrico */}
            <div>
                <img 
                src={Gs601} 
                className="flex h-flex w-flex "
                />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4 mt-6">
              <Zap className="w-6 h-6 mr-3 text-indigo-600" />
              1. Esquema Elétrico
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              A correta instalação do GS-601 é fundamental para seu perfeito funcionamento. Siga atentamente o diagrama de ligação abaixo.
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
                ou desligar o veículo (sinal positivo no fio azul do pós-chave), o GS-601 aciona o bloqueio 
                (somente ao ligar ignição) e começa a emitir um alerta sonoro, informando ao motorista 
                que deve informar o motivo da viagem ou parada e se identificar. Para se identificar, o 
                motorista deve aproximar o cartão na área marcada e aguardar 3 bipes curtos, 
                informando a leitura.
            </p>
            
            <p className="text-gray-700 leading-relaxed mt-4">
              Com o motorista identificado, o bloqueio é liberado e a viagem pode ser iniciada. Ao desligar o veículo, um bipe longo é emitido quando o logout automático é executado, e o veículo é bloqueado novamente.
            </p>


        
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
              2.2. Botões de jornada
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Com todos os botões desligados, ao ligar a ignição a primeira vez, o GS601 vai 
                bipar e piscar os botões Jornada e Manobra, indicando que o motorista deve iniciar uma 
                das duas funções. Após informar o motivo da partida, o motorista deve aproximar o 
                cartão sob o indicativo de sinal para identificação do motorista via RFID
            </p>
            
                <img 
              src={Cartao} 
              className="flex justify-center mx-50 h-100 w-flex "
              />
            
            <p>
                Após iniciada a função, o led dessa função se mantem aceso até que ela seja finalizada.  
              Ao desligar a ignição, o GS601 vai trabalhar de acordo com o que foi iniciado. Caso a 
              manobra tenha sido iniciada, o GS601 vai solicitar que o motorista a finalize, piscando 
              o led de manobra.
            </p>
            <br></br>
                <img 
                src={Ledjornada} 
                className="flex justify-center mx-50 h-100 w-flex "
                />
            <br></br>
            <p>
                No caso da função Jornada tenha sido inicializada, ao desligar a ignição, o 
              GS601 irá piscar os LEDS Jornada, Refeição, Repouso e Espera. O motorista pode 
              finalizar a jornada ou iniciar Refeição, Repouso e Espera. Essas 3 últimas funções só 
              podem ser usadas com a Jornada iniciada. 
            </p>
            <br></br>
             <img 
              src={led1} 
              className="flex justify-center mx-55 h-100 w-flex "
              />
            <p>
              Após iniciada uma das funções de Refeição, Repouso ou Espera, seu led vai ser 
            manter aceso e ao religar a ignição, ele irá piscar durante o bipe de solicitação de 
            atuação para que seja finalizado. 
            </p>
            <br></br>
             <img 
              src={led2} 
              className="flex justify-center mx-15 h-100 w-flex "
              />
              <img 
              src={led3} 
              className="flex justify-center mx-55 h-100 w-flex "
              />
            <div className=''>
              <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
                2.3. Botões de jornada – Modos de funcionamento: 
              </h3>
              <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3" >
                0 – Uso livre – 1 motorista 
              </h3>
              <p className="list-disc list-inside space-y-2 text-gray-700 ml-8">
                Nesse modo não será solicitado atualização ao desligar ou desligar a ignição. O 
                motorista pode usar os botões a qualquer momento, sempre seguindo a regra que 
                Refeição, Repouso e Espera só podem ser ativos depois da ativar a Jornada e após uma 
                dessas 3 funções ativas, deve-se finalizá-la antes de ativar outra função. 
              </p>
              <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3" >
                1 – Solicita atuação ao ligar e desligar ignição – 1 motorista
              </h3>
              <p className="list-disc list-inside space-y-2 text-gray-700 ml-8">
                Modo padrão de funcionamento, descrito acima na página 4. 
              </p>
              <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3" >
                2 – Uso livre com ignição ligada – Botões de Jornada – 1 motorista 
              </h3>
              <p className="list-disc list-inside space-y-2 text-gray-700 ml-8">
                Semelhante ao modo “Uso livre – 1 motorista” com o diferencial de apenas 
              aceitar atuação nos botões de Jornada com a ignição ligada. Este modo foi 
              desenvolvido para uso em rastreador que desligam a porta RS232 ao desligar a ignição 
              do veículo. 
              </p>
              <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3" >
                3 – Uso livre com ignição ligada – Todos os botões – 1 motorista  
              </h3>
              <p className="list-disc list-inside space-y-2 text-gray-700 ml-8">
                Semelhante ao modo “Uso livre – 1 motorista” com o diferencial de apenas 
              aceitar atuação em todos os botões com a ignição ligada. Este modo foi desenvolvido 
              para uso em rastreador que desligam a porta RS232 ao desligar a ignição do veículo. 
              </p>
              <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3" >
                4 – Uso livre – 2 motoristas   
              </h3>
              <p className="list-disc list-inside space-y-2 text-gray-700 ml-8"> 
                Semelhante ao modo “Uso livre – 1 motorista” com o diferencial de aceitar 2 
              motoristas usando os botões de jornada. Nesse modo os leds seguem o seguinte 
              padrão: Led apagado: Função desligada, Led aceso: Função ativa com 1 motorista, Led 
              piscando: Função ativa com 2 motoristas. 
              </p>
              <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3" >
                5 – Uso livre sem restrições 
              </h3>
              <p className="list-disc list-inside space-y-2 text-gray-700 ml-8">
                Nesse modo, o motorista pode usar livremente os botões, não há regras de 
              utilização, qualquer botão de jornada pode ser utilizado a qualquer momento.  
              </p>
              <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3" >
                6 – Uso livre com alerta de Jornada desligada – 1 motorista 
              </h3>
              <p className="list-disc list-inside space-y-2 text-gray-700 ml-8">
                Semelhante ao modo “Uso livre – 1 motorista” com o diferencial de solicitar 
              atuação no caso da jornada esteja desligada.
              </p>
              <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3" >
                O modo 1 é ativo por padrão de fábrica ou após um reset. 
              </h3>
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
              2.4 – Botões de jornada – Configuração: 
            </h3>
            <p className="list-disc list-inside space-y-2 text-gray-700 ml-8">
              O modo de funcionamento dos botões de jornada pode ser configurado via 
            comando RS232/TTL pelo comando 818, seguindo a tabela abaixo: 
            </p>
            <br></br>
              <CommandTable 
              title="Modo de funcionamento"
              data={[
                { comando: '818|0|', descricao: 'Botões de jornada com uso livre.' },
                { comando: '818|1|', descricao: 'Botões de jornada liberados apenas na alteração da ignição.' },
                { comando: '818|2|', descricao: 'Botões de jornada liberados apenas com ignição ligada.' },
                { comando: '818|3|', descricao: 'Todos os botões liberados apenas com ignição ligada.' },
                { comando: '818|4|', descricao: 'Botões de jornada com uso livre e 2 motoristas.' },
                { comando: '818|5|', descricao: 'Modo sem restrições.' },
                { comando: '818|6|', descricao: 'Uso livre com alerta de jornada desligada.' },
              ]}
            />

            
            
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
              2.5 – Botão cadeado = O botão cadeado pode ser configurado para as seguintes funções:  
            </h3>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3" >
                0 – Desativado 
              </h3>
              <p className="list-disc list-inside space-y-2 text-gray-700 ml-8">
              Nesse modo o botão é desativado e nenhuma função será ativa ao pressioná-lo.
            </p>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3" >
               1 – Login e Logout de ajudante ou segundo motorista 
              </h3>
              <p className="list-disc list-inside space-y-2 text-gray-700 ml-8">
                Nesse modo ao pressionar o botão pela primeira vez, o GS-601 irá solicitar 
              identificação via RFID. O ajudante ou segundo motorista deve apresentar o cartão para 
              fazer Login. Apertando uma segunda vez, o mesmo processo para Logout. 
            </p>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3" >
               2 – Identificação de passageiros 
              </h3>
              <p>
                Nesse modo ao pressionar o botão o GS-601 irá solicitar identificação via RFID. 
              O passageiro deve apresentar o cartão para identificação. Pode ser usado para quantos 
              passageiros forem necessários.
              </p>

         
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
              2.6 – Botão cadeado – Configuração:
            </h3>

            <p className="text-gray-700 leading-relaxed mb-4">
              O modo de funcionamento do botão cadeado pode ser configurado via 
            comando RS232/TTL pelo comando 815, seguindo a tabela abaixo: 
            </p>
              <CommandTable 
              title="Função botão cadeado"
              data={[
                { comando: '815|0|', descricao: 'Desabilitado.' },
                { comando: '815|1|', descricao: 'Login/logout do ajudante/segundo motorista via botão cadeado.' },
                { comando: '815|2|', descricao: 'identicação de passageiros via botão cadeado.' },
              ]}
            />
            
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
              2.7 – Botões Função 1, 2 e 3 – Configuração
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4 pl-8">
              Os botões Função 1, Função 2 e Função 3 servem para uso genérico. Podem ser 
            usados em códigos de 1, 2, 3 ou 4 dígitos. Por padrão, para maximizar as possibilidades 
            de uso, os botões são configurados para códigos de 4 dígitos, por exemplo: 1231, 1122, 
            3321, 3322, etc.  Ao pressionar 4 vezes qualquer combinação desses botões, o código é 
            enviado. Os códigos podem ter ou não identificação de RFID, por padrão desligada. 
            </p>
            <p className="text-gray-700 leading-relaxed mb-6 pl-8">
              O modo de funcionamento dos botões função pode ser configurado via 
            comando RS232/TTL pelos comandos 821 e 833, seguindo a tabela abaixo:  
            </p>
              <CommandTable 
              title="Tamanho do código de macro simples"
              data={[
                { comando: '821|0|', descricao: 'Botões desligados.' },
                { comando: '821|1|', descricao: 'Um digito.' },
                { comando: '821|2|', descricao: 'Dois digitos.' },
                { comando: '821|3|', descricao: 'Tres digitos.' },
                { comando: '821|4|', descricao: 'Quatro digitos (Padrão).' },
              ]}
            />
            <CommandTable 
              title="Solicitar RFID nos botões Função ( 1, 2 e 3 )"
              data={[
                { comando: '833|0|', descricao: 'Função desativada.' },
                { comando: '833|1|', descricao: 'Função ativada.' },
              ]}
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
              2.8 – Botão Manobra
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 pl-8">
              O botão manobra tem a função de início e fim de manobra. Por padrão, esse 
            botão só pode ser usado com jornada desligada. Ele possui as seguintes configurações:   
            </p>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3">
              Timeout
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 pl-8">
              Tempo máximo que o motorista pode permanecer em manobra. Após esse 
            tempo, o veículo é bloqueado. Alertas sonoros são emitidos faltando 15 e 10s para o 
            bloqueio.    
            </p>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3">
              Uso a qualquer momento
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 pl-8">
              Ao ativar essa função, a manobra pode ser iniciada quando outras funções de 
            Jornada já estiverem ativas.    
            </p>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8  pl-3">
              Desabilita o envio do pacote de manobra com Jornada Ativa
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 pl-8">
              Ao ativar essa função, o pacote de dados informando que a manobra foi 
            iniciada ou finalizada quando a Jornada estiver ativa. Esta função serve para evitar 
            quebra de relatório em algumas plataformas.    
            </p>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
              2.9 – Botão Manobra – Configuração:
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 pl-8">
              O botão manobra pode ser configurado via comando RS232/TTL pelos 
            comandos 829, 830 e 832, seguindo a tabela abaixo:     
            </p>
            <CommandTable 
              title="Timeout da Manobra"
              data={[
                { comando: '829|30|', descricao: 'Maximo - 30 segundos para Timeout, 0 - desativa o Timeout.' },
              ]}
            />
            <CommandTable 
              title="Uso do botão manobra a qualquer momento"
              data={[
                { comando: '830|0|', descricao: 'Função desativada.' },
                { comando: '830|1|', descricao: 'Função ativada.' }
              ]}
            />
            <CommandTable 
              title="Desabilita o envio do pacote de manobra com jornada ativa"
              data={[
                { comando: '832|0|', descricao: 'Função desativada.' },
                { comando: '832|1|', descricao: 'Função ativada.' }
              ]}
            />

            

            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
              3.0 Saída 1 / Bloqueio: 
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 pl-8">
              A saída 1 do GS-601 possui 4 modos de funcionamento.  
            </p>
    

            <CommandTable 
              title="Comandos de Configuração do Bloqueio"
              data={[
                { comando: '803|2|', descricao: 'Qualquer cartão fará o desbloqueio (padrão de fábrica).' },
                { comando: '803|1|', descricao: 'Apenas cartões cadastrados farão o desbloqueio.' },
                { comando: '803|3|', descricao: 'Sempre ativo (bloqueado).' },
                { comando: '803|0|', descricao: 'Sempre desativado.' },
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
                { comando: '801|Numero|', descricao: 'Adiciona uma senha (até 9 dígitos) ou cartão à lista.' },
                { comando: '802|Numero|', descricao: 'Remove uma senha ou cartão da lista.' },
                { comando: '804|0|', descricao: 'Consulta a quantidade de itens cadastrados na lista.' },
                { comando: '807|0|', descricao: 'Apaga **todos** os itens da lista.' },
                { comando: '808|Numero|', descricao: 'Consulta se uma senha ou cartão específico está na lista.' },
              ]}
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-8 border-l-4 border-green-500 pl-3">
              Para lista completa de comandos, acessar : 
            </h3>
            <p className="text-sm text-gray-600">
                • <a 
                href="./protocolo-601" 
                className="text-blue-600 hover:underline" 
                target="_blank" 
                rel="noopener noreferrer"
                >
                Protocolo GS-601
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
      <Route path="/protocolo-601" element={<CardRegistrationCommandGenerator />} />
    </Routes>
  );
}

export default ManualGs601;




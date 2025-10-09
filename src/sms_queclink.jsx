import React, { useState, useCallback, useEffect } from 'react';
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
  MessageSquareText,
  MessageCircle
} from 'lucide-react';
import Logo from './assets/logo.png'

const whatsappNumber = '5541991676700'; // Formato internacional sem caracteres especiais
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico sobre produtos e ligações.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

// ----------------------------------------------------------------------
// NOVO COMPONENTE: GERADOR DE COMANDOS AT (RS232 VIA SMS)
// ----------------------------------------------------------------------

const ATCommandGenerator = () => {
    // Inicializa com valores padrão para que os comandos sejam gerados na primeira renderização
    const [commandInput, setCommandInput] = useState('');
    const [model, setModel] = useState('*');
    
    const [step1Command, setStep1Command] = useState('');
    const [step2Command, setStep2Command] = useState('');
    const [step3Command, setStep3Command] = useState('');

    const models = [
        "gv75", "gv75m", "gv300", "gv300m", "gv350m", "gv350ceu", "*"
    ];

    /**
     * Gera os 3 comandos AT (GTURT e GTDAT) com base no input e modelo.
     */
    const generateCommands = useCallback(() => {
        const textInputValue = commandInput.trim() || "736|1|";
        
        // 1 - Ativar GTDAT: AT+GTURT=model,1,7,8,1,0,2,0,,,FFFF$
        const step1 = `AT+GTURT=${model},1,7,8,1,0,2,0,,,FFFF$`;
        
        // 2 - Enviar o comando: AT+GTDAT=model,1,,textInputValue,0,,,,FFFF$
        const step2 = `AT+GTDAT=${model},1,,${textInputValue},0,,,,FFFF$`;
        
        // 3 - Volta ao modo Driver ID: AT+GTURT=model,3,7,8,1,0,2,0,2,2,FFFF$
        const step3 = `AT+GTURT=${model},3,7,8,1,0,2,0,2,2,FFFF$`;

        setStep1Command(step1);
        setStep2Command(step2);
        setStep3Command(step3);
    }, [commandInput, model]);

    // Executa a geração de comandos na montagem e sempre que input/modelo mudar
    useEffect(() => {
        generateCommands();
    }, [generateCommands]);

    // --- ESTRUTURA JSX ---
    return (
        // Container principal com largura máxima e CENTRALIZADO (mx-auto adicionado)
        <div className="bg-white p-6 rounded-xl w-full max-w-2xl mx-auto shadow-lg border border-gray-100">
            <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-blue-800 mb-1 flex items-center justify-center space-x-2">
                    <MessageSquareText className="w-5 h-5 text-blue-600" />
                    <span>Gerador de Comandos Queclink (RS232 via SMS)</span>
                </h3>
                <p className='text-base text-gray-500'>
                    Ferramenta para criar a sequência de comandos SMS para transmissão RS232
                    em 3 passos.
                </p>
            </div>
            
            <div className="space-y-6">
                
                {/* 1. INPUT DE COMANDO */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="commandInput" className="block text-gray-700 font-medium text-lg">
                        Comando RS232:
                    </label>
                    <Input
                        id="commandInput"
                        type="text"
                        value={commandInput}
                        onChange={(e) => setCommandInput(e.target.value)}
                        placeholder="Ex: 736|1|"
                        className="p-3 text-xl font-mono" // Fonte maior
                    />
                </div>

                {/* 2. SELETOR DE MODELO E BOTÃO */}
                <div className="flex items-end space-x-4">
                    <div className="flex-1 flex flex-col space-y-2">
                        <label htmlFor="modelSelector" className="block text-gray-700 font-medium text-lg">
                            Selecione o Modelo:
                        </label>
                        <select
                            id="modelSelector"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            // Estilização com fonte maior
                            className="p-3 border border-gray-300 rounded-lg text-xl bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            {models.map(m => (
                                <option key={m} value={m}>{m.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>

                    <Button 
                        onClick={generateCommands}
                        // Fonte maior no botão
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-lg"
                    >
                        <Repeat className="w-5 h-5 mr-2" />
                        Gerar Comandos
                    </Button>
                </div>

                {/* 3. BLOCO DE RESULTADOS */}
                <div className="p-4 border border-indigo-200 rounded-xl bg-indigo-50 space-y-4">
                    <h4 className="text-xl font-bold text-indigo-800">Passos de Envio (Sequência de Comandos SMS)</h4>
                    
                    <div className="space-y-3">
                        {/* Passo 1 */}
                        <div>
                            <p className="font-semibold text-lg text-gray-700">1 - Ativar GTDAT:</p>
                            <pre className="bg-white p-3 rounded-lg border border-gray-300 text-base overflow-auto font-mono whitespace-pre-wrap"> {/* Fonte maior no comando */}
                                {step1Command}
                            </pre>
                        </div>
                        
                        {/* Passo 2 */}
                        <div>
                            <p className="font-semibold text-lg text-gray-700">2 - Enviar o comando:</p>
                            <pre className="bg-white p-3 rounded-lg border border-gray-300 text-base overflow-auto font-mono whitespace-pre-wrap"> {/* Fonte maior no comando */}
                                {step2Command}
                            </pre>
                        </div>
                        
                        {/* Passo 3 */}
                        <div>
                            <p className="font-semibold text-lg text-gray-700">3 - Volta ao modo Driver ID:</p>
                            <pre className="bg-white p-3 rounded-lg border border-gray-300 text-base overflow-auto font-mono whitespace-pre-wrap"> {/* Fonte maior no comando */}
                                {step3Command}
                            </pre>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// COMPONENTE PRINCIPAL (APP)
// ----------------------------------------------------------------------

function App() {
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


      {/* Suporte Section (Inclui o Novo Gerador AT) */}
      <section id="suporte" className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4">
              Ferramenta de Suporte
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Gerador de Comandos AT (RS232)
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
                Utilize esta ferramenta para gerar a sequência de comandos AT necessária para enviar comandos RS232 via SMS para o rastreador.
            </p>
            <br></br>
            <h2 className="text-lg  max-w-4xl mx-auto">
                📋 Passo a passo: <br></br>
                Para GS-404 deve-se enviar os 3 passos..<br></br>
                GS-301, GS-302 ou GS-601, apenas o passo 2..<br></br>
                Cada passo deve ser enviado em um SMS separado e aguardar o rastreador responder "OK".<br></br><br></br>
                ⚠️ Atenção:<br></br>
            </h2>
                <div className="text-center pt-2">
                    <Badge className="bg-yellow-100 text-purple-800 hover:bg-purple-200 text-base font-semibold py-2 px-4 shadow-sm">
                    Os comandos gerados não devem ser editados manualmente.
                    Sempre use o gerador para garantir o formato correto e o checksum válido.<br></br>
                    Alterações podem causar falhas de comunicação com o acessório.
                    </Badge>
                </div>
          </div>

          {/* NOVO GERADOR DE COMANDOS AT */}
          <div className='w-full'> {/* w-full para o mx-auto do componente funcionar */}
            <ATCommandGenerator />
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
                    <h4 className="font-semibold mb-2">1. Alimentação</h4>
                    <p className="text-sm text-gray-600">O acessório e o rastreador devem ter o GND/Negativo interligados ou compartilhar a mesma fonte.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h4 className="font-semibold mb-2">2. Ligação (Invertida)</h4>
                    <p className="text-sm text-gray-600">Inverter RX e TX: TX do acessório no RX do rastreador e vice-versa.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h4 className="font-semibold mb-2">3. Configuração</h4>
                    <p className="text-sm text-gray-600">Configurar o rastreador com taxa de transmissão padrão **19200 8N1**.</p>
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
                  <p className="text-gray-300">(41) 99167-6700</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="font-medium">E-mail:</p>
                  <p className="text-gray-300">contato@getscale.com.br</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="font-medium">Endereço:</p>
                  <p className="text-gray-300">Rua T. Cel. Carlos Souza , 104 - Centro - São João do Triunfo, PR</p>
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

export default App;
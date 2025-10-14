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
  MessageSquareText,
  MessageCircle
} from 'lucide-react';
import Logo from './assets/logo.png'

const whatsappNumber = '5541991676700'; // Formato internacional sem caracteres especiais
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
// ----------------------------------------------------------------------
// FUNÇÕES DE LÓGICA DO GERADOR DE COMANDOS SMS
// ----------------------------------------------------------------------

/**
 * Calcula o Checksum (soma dos valores ASCII, máscara 0xFF, em Hex).
 * @param {string} str - A string do comando RS232.
 * @returns {string} O Checksum Hex de 2 dígitos.
 */
const calculateChecksum = (str) => {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i);
    }
    return (sum & 0xFF).toString(16).toUpperCase().padStart(2, '0');
};

/**
 * Gera os comandos SMS ST300DEX e DEX (4000) para um único par ID/Comando.
 * @param {string} id - ID do rastreador.
 * @param {string} command - Comando RS232.
 * @returns {{linha300: string, linha4000: string, checksum: string}}
 */
const generateSingleSMSCommand = (id, command) => {
    const checksum = calculateChecksum(command);
    const len4000 = command.length.toString().padStart(4, '0');
    const len300 = command.length; // Comprimento simples para ST300DEX

    // Linha 300: ST300DEX;<ID>;02;<Comprimento>;<Comando>;<Checksum>
    const linha300 = `ST300DEX;${id};02;${len300};${command};${checksum}`;
    
    // Linha 4000: DEX;<ID>;<Comprimento_4_dígitos>;<Comando>;<Checksum>
    const linha4000 = `DEX;${id};${len4000};${command};${checksum}`;

    return { linha300, linha4000, checksum };
};


// ----------------------------------------------------------------------
// NOVO COMPONENTE: GERADOR DE COMANDOS SMS (MODO LOTE)
// ----------------------------------------------------------------------

const SMSCommandGenerator = () => {
    // Textareas para entradas em lote
    const [inputIDs, setInputIDs] = useState(''); 
    const [inputCommands, setInputCommands] = useState(''); 
    const [batchResult, setBatchResult] = useState("Insira os IDs de Rastreador e os Comandos RS232 (um por linha) para gerar os comandos SMS."); 
    
    /**
     * Processa os dois Textareas, gerando comandos SMS para cada par.
     */
    const processCommands = useCallback(() => {
        setBatchResult('Processando...');
        
        const ids = inputIDs.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
            
        const commands = inputCommands.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
            
        if (ids.length === 0 || commands.length === 0) {
            setBatchResult("Por favor, insira pelo menos um ID de Rastreador e um Comando.");
            return;
        }

        const maxLines = Math.min(ids.length, commands.length);
        const convertedLines = [];

        for(let i = 0; i < maxLines; i++) {
            const id = ids[i];
            const command = commands[i];

            if (id && command) {
                const result = generateSingleSMSCommand(id, command);
                // Retorna ID, Comando Original e as duas Linhas SMS geradas
                convertedLines.push(`${id} | ${command} | ${result.linha300} | ${result.linha4000}`);
            } else {
                 convertedLines.push(`[ERRO] Falha no paramento (linha ${i + 1}).`);
            }
        }
        
        // 3. Cria o resultado final com um cabeçalho colunar
        const header = [
            `--- Gerador de Comandos SMS  - ${maxLines} Comandos Processados ---`,
            `| ${'ID'.padEnd(11)} | ${'COMANDO ORG.'.padEnd(12)} | ${'LINHA ST300'.padEnd(35)} | LINHA ST4305/ST8300`,
        ].join('\n');
        
        // Formata as linhas para se alinharem com o cabeçalho
        const alignedLines = convertedLines.map(line => {
             const parts = line.split(' | ');
             if(parts.length === 4) {
                 return `| ${parts[0].padEnd(10)} | ${parts[1].padEnd(12)} | ${parts[2].padEnd(35)} | ${parts[3]}`;
             }
             return line;
        });
        
        const finalResults = [header, ...alignedLines].join('\n');
        
        setBatchResult(finalResults);

    }, [inputIDs, inputCommands]);

    /**
     * Função para iniciar o download do arquivo de texto.
     */
    const handleDownload = useCallback(() => {
        if (!batchResult || batchResult.includes('Insira os IDs')) {
            alert("Nenhum dado gerado para download.");
            return;
        }

        const blob = new Blob([batchResult], { type: 'text/plain;charset=utf-8' });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `comandos_sms_${Date.now()}.txt`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); 
    }, [batchResult]);


    // --- ESTRUTURA JSX ---
    return (
        <div className="bg-white p-6 rounded-xl w-full shadow-lg border border-gray-100">
            <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-blue-800 mb-1 flex items-center justify-center space-x-2"> {/* AUMENTADO */}
                    <MessageSquareText className="w-5 h-5 text-blue-600" />
                    <span>Gerador de Comandos SMS para RS232</span>
                </h3>
                <p className='text-base text-gray-500'> {/* AUMENTADO */}
                    Insira a lista de IDs de Rastreador e a lista de Comandos RS232, um por linha.
                </p>
            </div>
            
            <div className="space-y-4">
                
                {/* 1. INPUTS DE DADOS (Duas Textareas Lado a Lado) */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label htmlFor="inputIDs" className="block text-gray-700 font-medium mb-1 text-base"> {/* AUMENTADO */}
                            IDs de Rastreador:
                        </label>
                        <Textarea
                            id="inputIDs"
                            name="inputIDs"
                            rows="8"
                            value={inputIDs}
                            onChange={(e) => setInputIDs(e.target.value.replace(/[^0-9\n]/g, ''))} // Apenas números e quebras de linha
                            placeholder="Ex:&#10;1234567890&#10;9876543210&#10;1122334455"
                            className="w-full p-2 text-sm font-mono focus:ring-blue-500" // AUMENTADO
                        />
                        <p className="text-sm text-gray-500 mt-1 text-right"> {/* AUMENTADO */}
                           IDs: {inputIDs.split('\n').filter(l => l.trim().length > 0).length}
                        </p>
                    </div>

                    <div>
                        <label htmlFor="inputCommands" className="block text-gray-700 font-medium mb-1 text-base"> {/* AUMENTADO */}
                            Comandos RS232:
                        </label>
                        <Textarea
                            id="inputCommands"
                            name="inputCommands"
                            rows="8"
                            value={inputCommands}
                            onChange={(e) => setInputCommands(e.target.value)} 
                            placeholder="Ex:&#10;712|0|&#10;706|1|&#10;734|0|"
                            className="w-full p-2 text-sm font-mono focus:ring-blue-500" // AUMENTADO
                        />
                         <p className="text-sm text-gray-500 mt-1 text-right"> {/* AUMENTADO */}
                            Comandos: {inputCommands.split('\n').filter(l => l.trim().length > 0).length}
                        </p>
                    </div>
                </div>

             
                

                {/* 2. BOTÃO PROCESSAR */}
                <Button 
                    onClick={processCommands}
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-base" 
                    disabled={inputIDs.trim().length === 0 || inputCommands.trim().length === 0}
                >
                    <Repeat className="w-4 h-4 mr-2" />
                    Gerar Comandos SMS
                </Button>

                {/* 3. VISUALIZAÇÃO E DOWNLOAD DO RESULTADO */}
                <div className="p-3 border border-indigo-200 rounded-lg bg-indigo-50 space-y-2">
                    <h5 className="text-lg font-bold text-indigo-800">Resultado da Geração de Comandos</h5> {/* AUMENTADO */}
                    
                    {/* Exibe o resultado da conversão */}
                    <pre className="bg-white p-2 rounded-lg border border-gray-200 text-sm font-mono overflow-auto h-48 whitespace-pre"> 
                        {batchResult}
                    </pre>

                    {/* Botão Download */}
                    <Button 
                        onClick={handleDownload}
                        disabled={batchResult.includes('Insira os IDs') || batchResult.length < 50}
                        className={`w-full font-semibold py-2 rounded-lg flex items-center justify-center transition duration-200 text-base ${ // AUMENTADO
                            batchResult.includes('Processando...') || batchResult.includes('Insira os IDs') 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download Resultados (.TXT)
                    </Button>
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


      {/* Suporte Section (Inclui o Novo Gerador SMS) */}
      <section id="suporte" className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4">
              Ferramenta de Suporte
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Gerador de Comandos SMS Suntech
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
                Use este gerador para criar comandos RS232 corretos e compatíveis com rastreadores da linha Suntech (ST300, ST4305, ST8300).
            </p>
            <br></br>
                        <h2 className="text-lg  max-w-4xl mx-auto">
                            📋 Passo a passo: <br></br>
                            1️⃣ Preencha o ID do rastreador com o número único (IMEI ou ID da plataforma).<br></br>
                            2️⃣ Digite o Comando RS232 desejado (ex: 701|123456|).<br></br>
                            3️⃣ Clique em Gerar SMS para ver os comandos gerados..<br></br><br></br>
                            ⚠️ Atenção:<br></br>
                        </h2>
                            <div className="max-w-4xl mx-auto pt-2">
    {/* Adicione: 'w-full', 'whitespace-normal', e 'text-wrap' para máxima compatibilidade. */}
    <Badge className="w-full sm:w-auto mx-auto text-center bg-yellow-100 text-purple-800 hover:bg-purple-200 text-base font-semibold py-2 px-4 shadow-sm whitespace-normal">
        Os comandos gerados não devem ser editados manualmente.
        Sempre use o gerador para garantir o formato correto.
        Alterações podem causar falhas de comunicação.
    </Badge>
</div>
            
          </div>

          {/* NOVO GERADOR DE COMANDOS SMS */}
          <div className='flex justify-center w-full'>
              <div className='max-w-4xl w-full'> {/* Container para limitar largura e centralizar */}
                <SMSCommandGenerator />
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
                    <h4 className="font-semibold mb-2">1. Alimentação</h4>
                    <p className="text-sm text-gray-600">O acessório e o rastreador devem ter o GND/Negativo interligados ou compartilhar a mesma fonte.</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h4 className="font-semibold mb-2">2. Ligação (Invertida)</h4>
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
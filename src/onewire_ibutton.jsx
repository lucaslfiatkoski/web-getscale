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
  Wifi, 
  Shield, 
  Settings, 
  Download, 
  CheckCircle,
  Key,
  Repeat,
  MessageCircle
} from 'lucide-react';

const whatsappNumber = '5541991676700'; // Formato internacional sem caracteres especiais
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico sobre produtos e ligações.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;


const convertSingleID = (input) => {
    const trimmedInput = input.trim().toUpperCase();

    // 1. Validação: 16 caracteres
    if (trimmedInput.length !== 16) {
        return { error: `Comprimento inválido (${trimmedInput.length}). Esperado: 16.` };
    }
    
    // 2. Validação: Hexadecimal
    const hexRegex = /^[0-9A-Fa-f]{16}$/;
    if (!hexRegex.test(trimmedInput)) {
        return { error: "Não é um valor hexadecimal válido." };
    }
    
    // 3. Divide em bytes (grupos de 2 caracteres)
    let bytes = [];
    for (let i = 0; i < trimmedInput.length; i += 2) {
        bytes.push(trimmedInput.substr(i, 2));
    }
    
    // 4. Inverte a ordem dos bytes (Result 1 - 8 bytes)
    let reversedBytes = bytes.reverse();
    let finalResult1 = reversedBytes.join("").toUpperCase();
    
    // 5. Remove o último byte (Result 2 - 7 bytes)
    let finalResult2 = finalResult1.slice(0, -2);
    
    return { finalResult1, finalResult2 };
};


// ----------------------------------------------------------------------
// NOVO COMPONENTE: CONVERSOR INVERSOR DE ACESSÓRIO HEX (16 chars) - MODO LOTE
// ----------------------------------------------------------------------

const AcessorioConverter = () => {
    // Agora usa Textarea para múltiplos IDs
    const [inputIDs, setInputIDs] = useState(''); 
    const [batchResult, setBatchResult] = useState('Os resultados da INVERSÃO aparecerão aqui. Insira os IDs acima (um por linha) e clique em "Processar".');
    
    /**
     * Processa o conteúdo do Textarea, convertendo cada linha.
     */
    const processIDs = useCallback(() => {
        setBatchResult('Processando...');
        
        const lines = inputIDs.split('\n')
            .map(line => line.trim().toUpperCase())
            .filter(line => line.length > 0);
            
        if (lines.length === 0) {
            setBatchResult("Nenhum ID inserido. Por favor, insira um ou mais IDs hexadecimais (um por linha).");
            return;
        }

        const convertedLines = lines.map(line => {
            const result = convertSingleID(line); 

            if (result.error) {
                return `[ERRO] ${line.padEnd(16)} | ${result.error}`;
            }

            // Retorna o ID Hex de entrada + os 2 resultados (separados por '|')
            return `${line.padEnd(16)} | ${result.finalResult1} | ${result.finalResult2}`;
        });
        
        // 3. Cria o resultado final com um cabeçalho colunar
        const header = [
            `--- Inversor de Acessório Hex (8 Bytes) - ${lines.length} IDs Processados ---`,
            `| ${'ID ORIGINAL'.padEnd(16)} | ${'(iNVERSÃO TOTAL)'.padEnd(15)} | (SEM ÚLTIMO BYTE)`,
        ].join('\n');
        
        // Formata as linhas para se alinharem com o cabeçalho
        const alignedLines = convertedLines.map(line => {
             const parts = line.split(' | ');
             if(parts.length === 3) {
                 return `| ${parts[0]} | ${parts[1].padEnd(15)} | ${parts[2]} `;
             }
             return line;
        });
        
        const finalResults = [header, ...alignedLines].join('\n');
        
        setBatchResult(finalResults);

    }, [inputIDs]);

    /**
     * Função para iniciar o download do arquivo de texto.
     */
    const handleDownload = useCallback(() => {
        if (!batchResult || batchResult.includes('Nenhum ID inserido')) {
            alert("Nenhum dado convertido para download.");
            return;
        }

        const blob = new Blob([batchResult], { type: 'text/plain;charset=utf-8' });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `acessorio_hex_inversao_${Date.now()}.txt`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); 
    }, [batchResult]);


    // --- ESTRUTURA JSX ---
    return (
        <div className="bg-white p-6 rounded-xl max-w-xl w-full shadow-lg mx-auto border border-gray-100">
            
            {/* Header */}
            <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-blue-800 mb-1 flex items-center justify-center space-x-2">
                    <Repeat className="w-6 h-6 text-blue-600" />
                    <span> Inversor de Acessório Hex </span>
                </h3>
                <p className='text-gray-500 text-sm'>Insira múltiplos IDs Hex de 16 caracteres (8 Bytes), um por linha.</p>
            </div>
            
            <div className="space-y-4">
                
                {/* 1. INPUT DE DADOS (Textarea Grande) */}
                <div>
                    <label htmlFor="inputIDs" className="block text-lg text-gray-700 font-medium mb-2">
                        IDs Hexadecimais (Um por linha):
                    </label>
                    <Textarea
                        id="inputIDs"
                        name="inputIDs"
                        rows="12" // Altura máxima para entrada
                        value={inputIDs}
                        onChange={(e) => setInputIDs(e.target.value.replace(/[^0-9A-Fa-f\n]/g, ''))} // Apenas Hex e quebras de linha
                        placeholder="Ex:&#10;AABBCCDD11223344&#10;0011223344556677&#10;FFEEDDCCBBAA9988"
                        className="w-full p-3 text-sm font-mono focus:ring-blue-500"
                    />
                     <p className="text-sm text-gray-500 mt-1 text-right">IDs na lista: {inputIDs.split('\n').filter(l => l.trim().length > 0).length}</p>
                </div>

                {/* 2. BOTÃO PROCESSAR */}
                <Button 
                    onClick={processIDs}
                    id="convertBtn" 
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-200 text-lg"
                    disabled={inputIDs.trim().length === 0}
                >
                    <Repeat className="w-5 h-5 mr-2" />
                    Processar inversão em Lote
                </Button>

                {/* 3. VISUALIZAÇÃO E DOWNLOAD DO RESULTADO */}
                <div className="p-4 border border-indigo-300 rounded-lg bg-indigo-50 space-y-3">
                    <h5 className="text-xl font-bold text-indigo-800">Resultado da inversão em Lote</h5>
                    
                    {/* Exibe o resultado da conversão */}
                    <pre className="bg-white p-3 rounded-lg border border-gray-300 text-xs sm:text-sm font-mono overflow-auto h-64 whitespace-pre">
                        {batchResult}
                    </pre>

                    {/* Botão Download */}
                    <Button 
                        onClick={handleDownload}
                        disabled={batchResult.includes('Nenhum ID inserido') || batchResult.length < 50 || batchResult.includes('Processando...')}
                        className={`w-full font-bold py-3 rounded-lg flex items-center justify-center transition duration-200 text-lg ${
                            batchResult.includes('Processando...') || batchResult.includes('Nenhum ID') 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        <Download className="w-5 h-5 mr-2" />
                        Download Resultados (.TXT)
                    </Button>
                </div>
            </div>
        </div>
    );
};



function App() {
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
    alert('Obrigado! Sua mensagem foi recebida.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-30">
            <div className="flex items-center space-x-2">
              
              <div>
                <img 
                  src="./logo.png" 
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
                      to="/" // AGORA APONTA PARA A ROTA RAIZ (APP.JSX)
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
                  // MODIFICAÇÃO: Usar Link para navegar para a rota raiz
                  return (
                    <Link 
                      key={id}
                      to="/" 
                      className="text-left text-gray-700 hover:text-blue-600 transition-colors font-medium capitalize"
                      // Adicionei este onClick para fechar o menu ao clicar em "Home"
                      onClick={() => setIsMenuOpen(false)} 
                    >
                      {id}
                    </Link>
                  );
                }

                        // 'contato' (e outros) continuam como botões de scroll
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


      {/* Suporte Section (Inclui o Conversor) */}
      <section id="suporte" className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4">
              Ferramentas de Suporte
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Inversor OneWire para GS100
            </h2>
            <h2>
                Insira no campo abaixo o ID completo do chaveiro ibutton. Deve ser inserido o valor completo.
            </h2>
          </div>

          <div className='flex justify-center w-full'>

              {/* NOVO CONVERSOR DE ID  */}
              <AcessorioConverter />
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
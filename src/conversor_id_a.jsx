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
  MessageCircle
} from 'lucide-react';
import cartaoAImage from './assets/cartao_a.png';
import Logo from './assets/logo.png';

const whatsappNumber = '5541991676700'; // Formato internacional sem caracteres especiais
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico sobre produtos e ligações.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

const RFiDConverter = () => {
  const [inputIDs, setInputIDs] = useState('');
  const [conversionResult, setConversionResult] = useState([]);
  const [outputText, setOutputText] = useState("Resultados da conversão aparecerão aqui. Insira os IDs acima e clique em 'Processar e Converter Lote'.");

  const convertBatch = useCallback(() => {
    const lines = inputIDs.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const results = [];
    
    // Define os cabeçalhos com espaçamento fixo. (Aumentei o ID A para 14, que é o máximo comum)
    const outputLines = [
        "ID A:     | Wiegand:     | Serial Hexa:| Serial Decimal:"
    ];
    

    if (lines.length === 0) {
        setConversionResult([]);
        setOutputText("Nenhum número válido foi inserido para conversão.");
        return;
    }

    lines.forEach(idA => {
        const idANumber = Number(idA);
        let result = { idA, wiegand: 'Inválido', serialHexa: 'Inválido', serialDecimal: 'Inválido' };

        if (!isNaN(idANumber) && idANumber > 0) {
            
            // --- Lógica de Conversão (Inalterada) ---
            let abatrackHexa = idANumber.toString(16).toUpperCase().padStart(6, '0');
            const abatrackLast4 = abatrackHexa.substring(abatrackHexa.length - 4); 
            const abatrackRest = abatrackHexa.substring(abatrackHexa.length - 6, abatrackHexa.length - 4); 

            const wiegandEnd = parseInt(abatrackLast4, 16);
            const wiegandBegin = parseInt(abatrackRest, 16);
            
            const wiegandEndStr = wiegandEnd.toString().padStart(5, '0');
            const wiegandBeginStr = wiegandBegin.toString().padStart(3, '0');
            const wiegandString = `${wiegandBeginStr},${wiegandEndStr}`;
            
            const facilityCodeHex = wiegandBegin.toString(16).toUpperCase().padStart(4, '0');
            const digitsAfterCommaHex = wiegandEnd.toString(16).toUpperCase().padStart(4, '0');
            const hexaString = facilityCodeHex + digitsAfterCommaHex;

            const decimalValue = parseInt(hexaString, 16);
            const decimalString = decimalValue.toString().padStart(10, '0');
            
            result.wiegand = `W: ${wiegandString}`;
            result.serialHexa = `S: ${hexaString}`;
            result.serialDecimal = decimalString;

            // Formatação com espaçamento FIXO.
            const idAPadded = idA.padEnd(10); // Padded para suportar até 14 dígitos ID A
            const wiegandPadded = `W: ${wiegandString}`.padEnd(13);
            const hexaPadded = `S: ${hexaString}`.padEnd(12);
            const decimalPadded = decimalString;

            outputLines.push(
                `${idAPadded}| ${wiegandPadded}| ${hexaPadded}| ${decimalPadded}`
            );

        } else {
             // Formatação para Inválido
             outputLines.push(`${idA.padEnd(14)}| Inválido     | Inválido   | Inválido`);
        }

        results.push(result);
    });

    setConversionResult(results);
    setOutputText(outputLines.join('\n'));

  }, [inputIDs]); 


  // Função de Download do TXT (inalterada)
  const handleDownload = () => {
    if (conversionResult.length === 0) {
        alert("Nenhum dado convertido para download.");
        return;
    }

    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cartoes_convertidos.txt');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); 
  };


  // --- ESTRUTURA JSX ---
  return (
    <div className="bg-white p-6 rounded-xl max-w-xl w-full shadow-lg mx-auto border border-gray-100">
        <div className="mb-4">
            <h3 className="text-2xl font-bold text-blue-800 mb-1 flex items-center space-x-2">
                 <Cpu className="w-6 h-6 text-blue-600" />
                <span>Conversor de Cartão ID A (Lote)</span>
            </h3>
            <p className="text-gray-600 text-sm">
                Insira vários IDs A, um por linha, para conversão simultânea e download.
            </p>
        </div>
        <br></br>
        <br></br>
        
        
        <div className="space-y-4">
            {/* CAMPO DE ENTRADA ID A - TEXTAREA */}
            <div>
                <label htmlFor="inputIDs" className="block text-gray-700 font-medium mb-1">
                    Números ID A (Um por linha):
                </label>
                <textarea
                    id="inputIDs"
                    name="inputIDs"
                    rows="8"
                    value={inputIDs}
                    onChange={(e) => setInputIDs(e.target.value)}
                    placeholder="Exemplo:&#10;01136128&#10;00565044&#10;12345678"
                    className="w-full p-3 border border-gray-300 rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
            </div>
            
            {/* BOTÃO CONVERTER */}
            <button 
                onClick={convertBatch}
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
                Processar e Converter Lote
            </button>

            {/* ÁREA DE RESULTADO E DOWNLOAD */}
            <div className="p-4 border border-indigo-200 rounded-lg bg-indigo-50 space-y-3">
                  <h4 className="text-lg font-bold text-indigo-800 flex justify-between items-center">
                    Resultado da Conversão ({conversionResult.length} itens válidos)
                    
                    {/* BOTÃO DE DOWNLOAD */}
                    <button 
                        onClick={handleDownload}
                        disabled={conversionResult.length === 0}
                        className={`text-white py-2 px-4 rounded-lg flex items-center text-sm transition duration-200 
                            ${conversionResult.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download (.TXT)
                    </button>
                </h4>
                
                {/* Visualização dos IDs Convertidos - ATENÇÃO ÀS CLASSES ABAIXO */}
                <pre className="bg-white p-2 rounded-lg border border-gray-200 text-xs sm:text-sm font-mono overflow-auto h-56 **whitespace-nowrap**">
                    {outputText}
                </pre>
            </div>
        </div>
    </div>
  );
};
// ----------------------------------------------------------------------
// FIM DA DEFINIÇÃO DO CONVERSOR
// ------------------------------------------------------------------------------------------------------------
const SpecificIDConverter = () => {
    // ESTADOS MODIFICADOS PARA LOTE
    const [inputIDs, setInputIDs] = useState(''); // Textarea input
    const [conversionResult, setConversionResult] = useState([]); // Array de resultados válidos
    const [formattedOutput, setFormattedOutput] = useState("Resultados da conversão aparecerão aqui. Insira os IDs acima e clique em 'Converter Lote'.");

    // Lógica de conversão
    const convertBatch = useCallback(() => {
        const lines = inputIDs.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const results = [];
        
        // Define os cabeçalhos com espaçamento fixo.
        const outputLines = [
            // O ID WIEGAND (AAA#####) ocupa 21 espaços para alinhamento
            "ID WIEGAND (AAA#####) | Serial Decimal:"
        ];

        if (lines.length === 0) {
            setConversionResult([]);
            setFormattedOutput("Nenhum número válido foi inserido para conversão.");
            return;
        }

        lines.forEach(input => {
            let result = { id: input, serialDecimal: 'Inválido' };
            const inputClean = input.replace(/\D/g, ''); // Limpa o input de não-dígitos

            // Garante que a entrada tem apenas dígitos e 8 de comprimento.
            if (inputClean.length === 8) {
                
                // Conversão:
                const parte1 = inputClean.substring(0, 3);
                const parte2 = inputClean.substring(3);

                // Converte as partes para hexadecimal (padStart(4, '0') para garantir 4 dígitos hex)
                const parte1Hex = parseInt(parte1, 10).toString(16).toUpperCase().padStart(4, '0');
                const parte2Hex = parseInt(parte2, 10).toString(16).toUpperCase().padStart(4, '0');

                // União das partes em hexadecimal (resulta em 8 dígitos hexadecimais)
                const hexUnido = parte1Hex + parte2Hex;

                // Converte de volta para decimal
                const decimalFinal = parseInt(hexUnido, 16);
                const decimalString = decimalFinal.toString().padStart(10, '0');

                result.serialDecimal = decimalString;
                results.push(result);

                // Formatação com espaçamento FIXO.
                const inputPadded = inputClean.padEnd(21); 
                const decimalPadded = decimalString;

                outputLines.push(
                    `${inputPadded}| ${decimalPadded}`
                );

            } else {
                // Formatação para Inválido
                outputLines.push(`${input.padEnd(21)}| Inválido (Esperado 8 dígitos)`);
            }
        });

        setConversionResult(results);
        setFormattedOutput(outputLines.join('\n'));

    }, [inputIDs]);

    // Função de Download
    const handleDownload = () => {
        if (conversionResult.length === 0) {
            alert("Nenhum dado convertido para download.");
            return;
        }

        const blob = new Blob([formattedOutput], { type: 'text/plain;charset=utf-8' });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // Nome do arquivo de download
        link.setAttribute('download', `ids_serial_convertidos.txt`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); 
    };

    return (
        <Card className="bg-white p-6 rounded-xl max-w-xl w-full shadow-lg mx-auto border border-gray-100">
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-blue-800 mb-1 flex items-center space-x-2">
                 <Cpu className="w-6 h-6 text-blue-600" />
                <span>Conversor para cartões RFID W para Serial decimal</span>
            </h3>
            <p className="text-gray-600 text-sm">
                Insira no campo abaixo o número do id W: do cartão a ser convertido.
            </p>
          </div>
            <CardContent className="space-y-4 p-0">
                {/* CAMPO DE ENTRADA ID A - TEXTAREA (NOVO) */}
                <div>
                    <label htmlFor="inputIDsV2" className="block text-gray-700 font-medium mb-1">
                        IDs de 8 Dígitos (Um por linha):
                    </label>
                    <textarea
                        id="inputIDsV2"
                        name="inputIDsV2"
                        rows="8" // Aumentado para lote
                        value={inputIDs}
                        onChange={(e) => setInputIDs(e.target.value)}
                        placeholder="Exemplo:&#10;00363021&#10;11000001&#10;99999999"
                        className="w-full p-3 border border-gray-300 rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>

                
                <button 
                    onClick={convertBatch}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    disabled={inputIDs.trim().length === 0}
                >
                    Processar e Converter Lote
                </button>
                
                {/* ÁREA DE RESULTADO E DOWNLOAD */}
                <div className="p-4 border border-indigo-200 rounded-lg bg-indigo-50 space-y-3">
                    <h4 className="text-lg font-bold text-indigo-800 flex justify-between items-center">
                        Resultado da Conversão ({conversionResult.length} itens válidos)
                        
                        {/* BOTÃO DE DOWNLOAD */}
                        <button 
                            onClick={handleDownload}
                            // Habilita se há resultados válidos
                            disabled={conversionResult.length === 0}
                            className={`text-white py-2 px-4 rounded-lg flex items-center text-sm transition duration-200 
                                ${conversionResult.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download (.TXT)
                        </button>
                    </h4>
                    
                    {/* Visualização do ID Convertido */}
                    <pre className="bg-white p-2 rounded-lg border border-gray-200 text-xs sm:text-sm font-mono overflow-auto h-56 **whitespace-nowrap**">
                        {formattedOutput}
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
};
// ----------------------------------------------------------------------
// FIM DA DEFINIÇÃO DO NOVO CONVERSOR
// --------------------------------------

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
              Conversor de Cartões RFID ID A e W
            </h2>
            <div className="flex justify-center mb-16"> 
                <img 
                    // CORREÇÃO: Usando a variável importada 'cartaoAImage'
                    src={cartaoAImage} 
                    alt="Exemplo de Cartão RFID ID A" 
                    className="h-100  rounded-lg shadow-lg"
                />
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* CONVERSOR DE CARTÃO RFID - LOTE */}
              <RFiDConverter /> 

              {/* NOVO CONVERSOR DE ID A 8 DÍGITOS ESPECÍFICO */}
              <SpecificIDConverter />
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
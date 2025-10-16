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
import cartaoBImage from './assets/cartao_b.png';
import Logo from './assets/logo.png';

// --- FUNÇÕES DE LÓGICA DO CONVERSOR (iButton/Dallas Key) ---

/**
 * Converte uma string hexadecimal em um array de bytes (inteiros).
 */
const hexStringToBytes = (hexString) => {
    let bytes = [];
    for (let i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    return bytes;
};
const whatsappNumber = '5541991676700'; // Formato internacional sem caracteres especiais
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;


/**
 * Inverte a ordem dos bytes em uma string hexadecimal (par a par).
 */
const invertBytes = (hexString) => {
    // Certifica-se de que a string tem um número par de caracteres e inverte pares de 2 (bytes)
    return hexString.match(/../g)?.reverse().join('') || '';
};

/**
 * Atualiza o CRC8 (Dallas/1-Wire) com o próximo byte de dados.
 */
const crc8Update = (crc, data) => {
    crc = crc ^ data;
    for (let i = 0; i < 8; i++) {
        if (crc & 0x01) {
            crc = (crc >> 1) ^ 0x8C; // Polinômio
        } else {
            crc >>= 1;
        }
    }
    return crc;
};

/**
 * Calcula o CRC8 (Dallas/1-Wire) para uma string hexadecimal.
 */
const calculateCRCDallas = (hexString) => {
    let bytes = hexStringToBytes(hexString);
    let crc = 0;
    for (let byte of bytes) {
        crc = crc8Update(crc, byte);
    }
    return crc;
};

/**
 * Converte um valor decimal em uma chave Dallas/iButton nos três formatos solicitados.
 */
const convertDallasKey = (decimalValue) => {
    // O limite máximo para 6 bytes (48 bits) é 0xFFFFFFFFFFFF
    if (isNaN(decimalValue) || decimalValue < 0 || decimalValue > 0xFFFFFFFFFFFF) {
        return null;
    }
    
    // 1. Converte decimal para hexa (6 bytes/12 dígitos)
    let hexValue = decimalValue.toString(16).toUpperCase().padStart(12, '0');

    // 2. Adiciona o byte de Família (01h para DS1990A)
    let hexValueWithSuffix = hexValue + '01'; 

    // 3. Inverte a ordem dos 7 bytes
    let invertedHexValue = invertBytes(hexValueWithSuffix); 

    // 4. Calcula o CRC-8 Dallas no valor invertido
    let crc = calculateCRCDallas(invertedHexValue).toString(16).toUpperCase().padStart(2, '0');

    // MODO 1: ID INVERTIDO (6 BYTES DE DADOS + 1 BYTE DE FAMÍLIA) - 14 DÍGITOS
    const modo1 = invertedHexValue;

    // MODO 2: MODO 1 + CRC (Padrão) - 16 DÍGITOS
    const modo2 = invertedHexValue + crc;

    // MODO 3: CRC + ID ORIGINAL (6 BYTES DE DADOS + 1 BYTE DE FAMÍLIA) - 16 DÍGITOS
    const modo3 = crc + hexValueWithSuffix;

    return { modo1, modo2, modo3 };
};

/**
 * Converte a string hexadecimal dos dados (6 bytes) para o ID Decimal.
 */
const hexToDecimal = (dataHex) => {
    // Usa BigInt para garantir precisão com 48 bits (12 caracteres hex)
    return BigInt(`0x${dataHex}`).toString();
};


// ----------------------------------------------------------------------
// LÓGICA DO CONVERSOR INVERSO (FIX CORRIGIDO PARA POSIÇÃO DO BYTE DE FAMÍLIA)
// ----------------------------------------------------------------------

/**
 * Tenta analisar e extrair o ID de 6 bytes de dados de um ID Hex (14 ou 16 caracteres).
 * @param {string} hexID - ID Hex de 14 ou 16 caracteres.
 * @returns {{dataHex: string, mode: string, isValidCRC: boolean} | null}
 */
const parseDallasKeyHex = (hexID) => {
    const cleanID = hexID.toUpperCase().replace(/[^0-9A-F]/g, '');
    const len = cleanID.length;
    let dataHex = null; // Os 6 bytes originais de dados (12 caracteres)
    let mode = "Desconhecido";
    let isValidCRC = undefined; // Undefined para Modo 1, boolean para Modos 2 e 3

    if (len === 14) {
        // Assume Modo 1: 01 + D1 D2 D3 D4 D5 D6 (ID Invertido: Família no início)
        const familyByte = cleanID.slice(0, 2); // Verifica os dois primeiros caracteres
        
        if (familyByte === '01') {
            const invertedData = cleanID.slice(2, 14); // 12 chars dos dados invertidos
            dataHex = invertBytes(invertedData); // Reverte para extrair os 6 bytes originais
            mode = "Modo 1 (14 dígitos, ID Invertido s/ CRC)";
            isValidCRC = true; // Não tem CRC para validar
        } else {
             return null; // Falha no formato (Família diferente de 01 no início)
        }

    } else if (len === 16) {
        
        // 1. Tenta Modo 2: 01 + D1 D2 D3 D4 D5 D6 + CRC (ID Invertido: Família no início)
        if (cleanID.slice(0, 2) === '01') {
            const invertedIDWithFamily = cleanID.slice(0, 14); // 14 chars para cálculo do CRC
            const dataBytesReversed = invertedIDWithFamily.slice(2, 14); // 12 chars dos dados invertidos
            dataHex = invertBytes(dataBytesReversed); // Reverte para extrair os 6 bytes originais
            
            const crc = cleanID.slice(14, 16);
            const calculatedCRC = calculateCRCDallas(invertedIDWithFamily).toString(16).toUpperCase().padStart(2, '0');
            isValidCRC = (calculatedCRC === crc);
            
            mode = `Modo 2 (16 dígitos, ID Invertido c/ CRC)`;
            
        } 
        // 2. Tenta Modo 3: CRC + D6 D5 D4 D3 D2 D1 + 01 (ID Original: Família no fim)
        else if (cleanID.slice(-2) === '01') {
             const crc = cleanID.slice(0, 2);
             dataHex = cleanID.slice(2, 14).slice(0, 12); // 12 chars dos dados originais

             // O CRC é calculado sobre a versão invertida (Família + Dados Invertidos)
             const invertedIDWithFamily = invertBytes(dataHex + '01');
             const calculatedCRC = calculateCRCDallas(invertedIDWithFamily).toString(16).toUpperCase().padStart(2, '0');
             isValidCRC = (calculatedCRC === crc);
            
             mode = `Modo 3 (16 dígitos, CRC + ID Original)`;
        } else {
             return null; // Falha no formato
        }

    } else {
        return null; // Comprimento inválido
    }

    // Retorna o resultado se o dado foi extraído com sucesso
    if (dataHex && dataHex.length === 12) {
        return { dataHex, mode, isValidCRC };
    }
    return null;
};


// ----------------------------------------------------------------------
// COMPONENTE DE CONVERSOR DECIMAL -> HEX
// ----------------------------------------------------------------------

const DallasKeyConverter = () => {
    // Textarea armazena todos os IDs de entrada
    const [inputIDs, setInputIDs] = useState(''); 
    // Resultado da conversão em lote (o texto para exibição e download)
    const [batchResult, setBatchResult] = useState("Os resultados da conversão aparecerão aqui. Insira os IDs acima e clique em 'Processar'."); 
    
    /**
     * Processa o conteúdo do Textarea, convertendo cada linha nos 3 modos.
     */
    const processIDs = useCallback(() => {
        setBatchResult('Processando...');
        
        const lines = inputIDs.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
            
        if (lines.length === 0) {
            setBatchResult("Nenhum ID inserido para conversão. Por favor, insira um ou mais IDs decimais (um por linha).");
            return;
        }

        const convertedLines = lines.map(line => {
            const trimmedLine = line.trim();
            
            try {
                const decimalValue = BigInt(trimmedLine);
                // Limite: 6 bytes de dados = 0xFFFFFFFFFFFF
                if (decimalValue < 0 || decimalValue > BigInt('0xFFFFFFFFFFFF')) {
                    return `[INVÁLIDO] ${trimmedLine} | Valor fora do limite.`;
                }
                
                const result = convertDallasKey(Number(trimmedLine)); 
                if (!result) return `[ERRO] ${trimmedLine} | Falha na conversão.`;

                // Retorna o ID Decimal de entrada + os 3 modos (separados por '|')
                return `${trimmedLine} | ${result.modo1} | ${result.modo2} | ${result.modo3}`;
            } catch (e) {
                return `[INVÁLIDO] ${trimmedLine} | Não é um número decimal válido.`;
            }
        });
        
        // 3. Cria o resultado final com um cabeçalho colunar
        const header = [
            `--- Conversor cartão para OneWire - ${lines.length} IDs Processados ---`,
            `| ${'ID DECIMAL'.padEnd(12)} | ${'MODO 1 '.padEnd(15)} | ${'MODO 2 '.padEnd(16)} | MODO 3 `,
        ].join('\n');
        
        // Formata as linhas para se alinharem com o cabeçalho
        const alignedLines = convertedLines.map(line => {
             const parts = line.split(' | ');
             if(parts.length === 4) {
                 return `| ${parts[0].padEnd(12)} | ${parts[1].padEnd(15)} | ${parts[2].padEnd(16)} | ${parts[3].padEnd(16)} `;
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
        link.setAttribute('download', `ibutton_decimal_to_hex_${Date.now()}.txt`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); 
    }, [batchResult]);


    // --- ESTRUTURA JSX UNIFICADA ---
    return (
        <div className="bg-white p-6 rounded-xl max-w-xl w-full shadow-lg mx-auto border border-gray-100">
            <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-blue-800 mb-1 flex items-center justify-center space-x-2">
                    <Key className="w-6 h-6 text-blue-600" />
                    <span>ID cartão para OneWire (3 Modos)</span>
                </h3>
            </div>
            
            <div className="space-y-4">
                
                {/* 1. INPUT DE DADOS (TEXTAREA) */}
                <div>
                    <label htmlFor="inputIDs" className="block text-lg text-gray-700 font-medium mb-1">
                        IDs Decimais (Um por linha):
                    </label>
                    <Textarea
                        id="inputIDs"
                        name="inputIDs"
                        rows="12" // Aumentado para 12
                        value={inputIDs}
                        onChange={(e) => setInputIDs(e.target.value.replace(/[^\d\n]/g, ''))} // Permite apenas dígitos e quebras de linha
                        placeholder="Ex:&#10;539669528&#10;1977717468&#10;123456789012"
                        className="w-full p-3 text-sm font-mono focus:ring-blue-500"
                    />
                </div>

                {/* 2. BOTÃO PROCESSAR */}
                <Button 
                    onClick={processIDs}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-200 text-lg"
                    disabled={inputIDs.trim().length === 0}
                >
                    <Repeat className="w-5 h-5 mr-2" />
                    Converter para Hex
                </Button>

                {/* 3. VISUALIZAÇÃO E DOWNLOAD DO RESULTADO */}
                <div className="p-4 border border-indigo-300 rounded-lg bg-indigo-50 space-y-3">
                    <h5 className="text-xl font-bold text-indigo-800">Resultado da Conversão</h5>
                    
                    {/* Exibe o resultado da conversão - h-80 -> h-64 e fonte menor */}
                    <pre className="bg-white p-3 rounded-lg border border-gray-300 text-xs sm:text-sm font-mono overflow-auto h-64 whitespace-pre">
                        {batchResult}
                    </pre>

                    {/* Botão Download */}
                    <Button 
                        onClick={handleDownload}
                        disabled={batchResult.includes('Nenhum ID inserido') || batchResult.length < 50}
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

// ----------------------------------------------------------------------
// COMPONENTE: CONVERSOR INVERSO HEX -> DECIMAL (FIX)
// ----------------------------------------------------------------------

const DallasKeyInverseConverter = () => {
    const [inputHexIDs, setInputHexIDs] = useState(''); 
    const [batchResult, setBatchResult] = useState("Os resultados da conversão inversa aparecerão aqui."); 
    
    /**
     * Processa o conteúdo do Textarea, convertendo cada linha (Hex) para Decimal.
     */
    const processInverseIDs = useCallback(() => {
        setBatchResult('Processando...');
        
        const lines = inputHexIDs.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
            
        if (lines.length === 0) {
            setBatchResult("Nenhum ID Hex inserido para conversão. Por favor, insira um ou mais IDs.");
            return;
        }

        const convertedLines = lines.map(line => {
            const trimmedLine = line.trim().toUpperCase();
            
            // 1. Tenta analisar o ID Hex
            const parseResult = parseDallasKeyHex(trimmedLine);
            
            if (!parseResult || !parseResult.dataHex) {
                return `[INVÁLIDO] ${trimmedLine} | Formato não reconhecido (Esperado 14 ou 16 dígitos com byte de família '01').`;
            }

            // 2. Converte o ID de 6 bytes (dataHex) para Decimal
            const decimalID = hexToDecimal(parseResult.dataHex);
            
            // 3. Formata o status do CRC
            const crcStatus = parseResult.isValidCRC === true
                ? 'CRC OK'
                : parseResult.isValidCRC === false 
                    ? 'CRC FALHO' 
                    : 's/ CRC'; // Modo 1

            // Retorna o ID Hex de entrada + o ID Decimal de saída + o Modo e Status
            return `${trimmedLine} | ${decimalID} | ${parseResult.mode} | ${crcStatus}`;
        });
        
        // 3. Cria o resultado final com um cabeçalho colunar
        const header = [
            `--- Conversor OneWire para Cartão - ${lines.length} IDs Processados ---`,
            `| ${'ID HEX (ENTRADA)'.padEnd(16)} | ${'ID DECIMAL (SAÍDA)'.padEnd(18)} | ${'MODO RECONHECIDO'.padEnd(16)}`,
        ].join('\n');
        
        // Formata as linhas para se alinharem com o cabeçalho
        const alignedLines = convertedLines.map(line => {
             const parts = line.split(' | ');
             if(parts.length === 4) {
                 // Remove o status do CRC para manter o alinhamento do cabeçalho
                 return `| ${parts[0].padEnd(16)} | ${parts[1].padEnd(18)} | ${parts[2].padEnd(16)} `;
             }
             return line;
        });
        
        const finalResults = [header, ...alignedLines].join('\n');
        
        setBatchResult(finalResults);

    }, [inputHexIDs]);

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
        link.setAttribute('download', `ibutton_hex_to_decimal_${Date.now()}.txt`);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); 
    }, [batchResult]);


    // --- ESTRUTURA JSX ---
    return (
        <div className="bg-white p-6 rounded-xl max-w-xl w-full shadow-lg mx-auto border border-gray-100">
            <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-blue-800 mb-1 flex items-center justify-center space-x-2">
                    <Repeat className="w-6 h-6 text-blue-600" />
                    <span>OneWire para ID cartão (Inverso)</span>
                </h3>
            </div>
            
            <div className="space-y-4">
                
                {/* 1. INPUT DE DADOS (TEXTAREA) */}
                <div>
                    <label htmlFor="inputHexIDs" className="block text-lg text-gray-700 font-medium mb-1">
                        IDs Hexadecimais (14 ou 16 dígitos, Um por linha):
                    </label>
                    <Textarea
                        id="inputHexIDs"
                        name="inputHexIDs"
                        rows="12" // Aumentado para 12
                        value={inputHexIDs}
                        onChange={(e) => setInputHexIDs(e.target.value.replace(/[^0-9A-Fa-f\n]/g, ''))} // Apenas Hex e quebras de linha
                        placeholder="Ex:&#10;DDCCBBAA998801 (Modo 1)&#10;DDCCBBAA998801E3 (Modo 2)&#10;E38899AABBCCDD01 (Modo 3)"
                        className="w-full p-3 text-sm font-mono focus:ring-blue-500"
                    />
                </div>

                {/* 2. BOTÃO PROCESSAR */}
                <Button 
                    onClick={processInverseIDs}
                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition duration-200 text-lg"
                    disabled={inputHexIDs.trim().length === 0}
                >
                    <Repeat className="w-5 h-5 mr-2" />
                    Converter para Decimal
                </Button>

                {/* 3. VISUALIZAÇÃO E DOWNLOAD DO RESULTADO */}
                <div className="p-4 border border-purple-300 rounded-lg bg-purple-50 space-y-3">
                    <h5 className="text-xl font-bold text-purple-800">Resultado da Conversão Inversa</h5>
                    
                    {/* Exibe o resultado da conversão - h-80 -> h-64 e fonte menor */}
                    <pre className="bg-white p-3 rounded-lg border border-gray-300 text-xs sm:text-sm font-mono overflow-auto h-64 whitespace-pre">
                        {batchResult}
                    </pre>

                    {/* Botão Download */}
                    <Button 
                        onClick={handleDownload}
                        disabled={batchResult.includes('Nenhum ID inserido') || batchResult.length < 50}
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

      

      {/* Suporte Section (Inclui os Conversores) */}
      <section id="suporte" className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4 text-sm px-3 py-1">
              Ferramentas de Suporte
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Conversor OneWire
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Use os conversores abaixo para alternar entre os formatos **Decimal** e **Hexadecimal**.
            </p>
            <div className="flex justify-center mb-16"> 
              <img 
               // CORREÇÃO: Usando a variável importada 'cartaoAImage'
              src={cartaoBImage} 
              alt="Exemplo de Cartão RFID ID A" 
              className="h-110 w-150 rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className='flex justify-center w-full'> 
              {/* max-w-7xl -> max-w-6xl */}
              <div className='grid grid-cols-1 xl:grid-cols-2 gap-12 w-full max-w-6xl'> 
                {/* CONVERSOR 1: DECIMAL -> HEX */}
                <DallasKeyConverter />
                
                {/* CONVERSOR 2: HEX -> DECIMAL (INVERSO) */}
                <DallasKeyInverseConverter />
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

export default App;
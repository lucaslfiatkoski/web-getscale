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
  Repeat,
  CreditCard,
  MessageCircle,
  MessageSquare
} from 'lucide-react';
import Logo from './assets/logo.png'



const MAX_CARDS = 10;
const whatsappNumber = '5541991676700'; // Formato internacional sem caracteres especiais
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico sobre produtos e ligações.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

const CardAdditionCommandGenerator = () => {
    const [cardInput, setCardInput] = useState('');
    const [generatedCommand, setGeneratedCommand] = useState('Insira os números dos cartões (um por linha) e clique em Gerar Comando.');
    const [cardCount, setCardCount] = useState(0);
    const [cardNumbers, setCardNumbers] = useState([]); // Armazena os números válidos

    // Lógica para processar o input em tempo real (limpeza, contagem e limite)
    useEffect(() => {
        // 1. Processa as linhas, filtra vazias, remove espaços/caracteres indesejados e limita a 10
        const numbers = cardInput.split('\n')
            .map(line => line.trim().replace(/[^0-9A-Za-z]/g, '')) // Permite números e letras para IDs
            .filter(line => line.length > 0)
            .slice(0, MAX_CARDS); // Limita a 10
        
        // Atualiza os estados de contagem e números válidos
        setCardNumbers(numbers);
        setCardCount(numbers.length);

        // Define a mensagem inicial se não houver cartões, mantendo o comando em branco.
        if (numbers.length === 0) {
             setGeneratedCommand('Insira os números dos cartões (um por linha) e clique em Gerar Comando.');
        }

    }, [cardInput]);


    /**
     * Gera o comando RS232 710 final (chamado no clique do botão).
     */
    const generateCommand = useCallback(() => {
        const count = cardNumbers.length;
        
        // Se a lista estiver vazia, gera o comando base
        if (count === 0) {
            setGeneratedCommand('710||'); 
            return;
        }

        // 2. Constrói o comando: 710|<count>|<card1>|<card2>|...|
        const commandBody = cardNumbers.join('|');
        const finalCommand = `710|${count}|${commandBody}|`;

        setGeneratedCommand(finalCommand);

    }, [cardNumbers]);


    // --- ESTRUTURA JSX ---
    return (
        // Container principal com largura máxima e CENTRALIZADO (mx-auto adicionado)
        <div className="bg-white p-6 rounded-xl w-auto mx-auto shadow-lg border border-gray-100">
            <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-blue-800 mb-1 flex items-center justify-center space-x-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span>Gerador de Comando RS232 710 (Adição de Cartões)</span>
                </h3>
                <p className='text-base text-gray-500'>
                    Gere o comando para adicionar até **{MAX_CARDS}** cartões de uma só vez.
                </p>
            </div>
            
            <div className="space-y-6">
                
                {/* 1. INPUT DE CARTÕES */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="cardInput" className="block text-gray-700 font-medium text-lg">
                        Números dos Cartões (Um por linha):
                    </label>
                    <Textarea
                        id="cardInput"
                        rows="8"
                        value={cardInput}
                        onChange={(e) => setCardInput(e.target.value)}
                        placeholder={`Cole até ${MAX_CARDS} números de cartões aqui.\nEx:\n111111\n22222\n33333`}
                        className="p-3 text-lg font-mono" // Fonte maior
                    />
                     <p className="text-sm text-gray-500 mt-1 text-right">
                        Cartões detectados: **{cardCount}** (Máximo: {MAX_CARDS})
                    </p>
                </div>


                {/* 2. BOTÃO GERAR */}
                <Button 
                    onClick={generateCommand}
                    disabled={cardCount === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 text-lg"
                >
                    <Repeat className="w-5 h-5 mr-2" />
                    Gerar Comando RS232 710
                </Button>

                {/* 3. BLOCO DE RESULTADOS */}
                <div className="p-4 border border-indigo-200 rounded-xl bg-indigo-50 space-y-4">
                    <h4 className="text-xl font-bold text-indigo-800">Comando RS232 Final</h4>
                    
                    <div className="space-y-3">
                        {/* Comando Gerado */}
                        <div>
                            <p className="font-semibold text-lg text-gray-700">Comando 710:</p>
                            <pre className="bg-white p-3 rounded-lg border border-gray-300 text-base overflow-auto font-mono whitespace-pre-wrap"> 
                                {/* Exibição do comando */}
                                {generatedCommand}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* 4. Observações e Estrutura */}
                <div className="pt-2">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Estrutura e Regras</h4>
                    <ul className="list-disc list-inside space-y-1 text-base text-gray-600">
                        {/* LINHA CORRIGIDA */}
                        <li>**Estrutura:** 710 | &lt;Total Cartões&gt; | &lt;Cartão 1&gt; | ... | &lt;Cartão N&gt; |</li>
                        <li>**Separador:** O caractere separador obrigatório é o **pipe** (`|`).</li>
                        <li>**Limite:** Máximo de **{MAX_CARDS}** cartões por comando.</li>
                        <li>**Encerramento:** O comando **deve terminar** com um pipe final.</li>
                    </ul>
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

    

      {/* Suporte Section (Inclui o Novo Gerador Cartão 710) */}
      <section id="suporte" className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4">
              Ferramenta de Suporte
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Gerador de Comandos RS232 (Cartões)
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
                Gere o comando RS232 **710** para adicionar cartões de acesso/identificação.
            </p>
          </div>

          {/* NOVO GERADOR DE COMANDOS CARTÃO 710 */}
          <div className='w-full'>
            <CardAdditionCommandGenerator />
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
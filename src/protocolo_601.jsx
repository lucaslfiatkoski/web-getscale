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
  Key,
  ChevronRight,
  Trash2, 
  Lock, 
  List, 
  PowerOff,
  Search,
  Zap,        // Ícone para apagar/ação rápida
  Clock,      
  Shuffle,    
  Settings,
  BellRing,   // Ícone para o comando 716
  UserCheck,  // NOVO: Ícone para 719 (Identificação Motorista)
  Bike,       // CORRIGIDO: Substitui Motorcycle, que estava causando o erro de exportação
  Repeat, 
  Nfc,
  Package,
  LogOut,
  MessageCircle  // NOVO: Ícone para 723 (Replicação RS232)
} from 'lucide-react';
import Logo from './assets/logo.png'

const whatsappNumber = '5541991676700'; // Formato internacional sem caracteres especiais
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico sobre produtos e ligações.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

// ----------------------------------------------------------------------
// CONSTANTES DE COMANDO
// ----------------------------------------------------------------------

// Limite de 0xFFFFFFFF (8 dígitos hexadecimais)
const MAX_HEX_DIGITS = 8;
const MAX_VALUE_DESCRIPTION = '0xFFFFFFFF';
// Limite de segundos para o comando 709 (Regra anterior)
const MAX_SECONDS_VALUE = 45000; 
// Limite de cartões para o comando 710
const MAX_CARDS_710 = 10;
const MAX_SECONDS_601 = 1800;
const IG_SECONDS_601 = 30;


// ----------------------------------------------------------------------
// COMPONENTE 1: DETALHE DO COMANDO RS232 701 (CADASTRO DE CARTÃO)
// ----------------------------------------------------------------------

const Command801Details = () => {
    const [cardID, setCardID] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('801|{ID_DO_CARTAO}|');

    const updateCommand = useCallback((id) => {
        const upperCaseID = id.toUpperCase();
        const cleanID = upperCaseID.replace(/[^0-9A-F]/g, '');
        const finalID = cleanID.slice(0, MAX_HEX_DIGITS);
        
        if (finalID.length === 0) {
            setCommandSyntax('801|{ID_DO_CARTAO}|');
        } else {
            setCommandSyntax(`801|${finalID}|`);
        }
        setCardID(finalID);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 801 - Cadastro de Motorista</span>
            </h4>
            <p className='text-base text-gray-700'>
                Este comando é usado para **adicionar** um novo cartão RFID à lista de motoristas autorizados na memória interna do dispositivo.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    801|{'{ID_DO_CARTAO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>ID\_DO\_CARTAO:</span> O número de identificação do cartão RFID a ser cadastrado. <span className='text-red-600 font-semibold'></span>
                    </p>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <Input
                        type="text"
                        value={cardID}
                        onChange={(e) => updateCommand(e.target.value)}
                        placeholder={`Insira um ID aqui (Máx. ${MAX_HEX_DIGITS} dígitos HEX)`}
                        className="p-2 text-sm font-mono flex-grow"
                        maxLength={MAX_HEX_DIGITS} 
                    />
                    <Badge className='bg-gray-200 text-gray-700 hover:bg-gray-200 text-xs'>
                        {cardID.length} / {MAX_HEX_DIGITS}
                    </Badge>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} {cardID.length > 0 && `// Cadastra o cartão de ID ${cardID}`}
                    </pre>
                </div>
            </div>
            <div className='space-y-2 pt-4 border-t border-blue-200'>
                <p className="font-semibold text-gray-800">Retorno do Módulo</p>
                <p className='text-sm text-gray-700'>
                    O módulo responderá confirmando a ação. O último parâmetro indica o resultado: 
                    <span className='font-bold text-green-700'> 1 para sucesso</span>, 
                    <span className='font-bold text-orange-700'> 2 para memória cheia</span> ou 
                    <span className='font-bold text-red-700'> 0 para erro</span>.
                </p>
                <pre className='bg-gray-100 p-3 rounded-lg border text-sm font-mono whitespace-pre-wrap'>
                    GTSL|8|1|2|801|123456|1|
                </pre>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 2: DETALHE DO COMANDO RS232 702 (REMOÇÃO DE CARTÃO)
// ----------------------------------------------------------------------

const Command802Details = () => {
    
    const [cardID, setCardID] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('802|{ID_DO_CARTAO}|');

    const updateCommand = useCallback((id) => {
        const upperCaseID = id.toUpperCase();
        const cleanID = upperCaseID.replace(/[^0-9A-F]/g, '');
        const finalID = cleanID.slice(0, MAX_HEX_DIGITS);
        
        if (finalID.length === 0) {
            setCommandSyntax('802|{ID_DO_CARTAO}|');
        } else {
            setCommandSyntax(`802|${finalID}|`);
        }
        
        setCardID(finalID);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Trash2 className='w-5 h-5' />
                <span>Comando 802 - Remoção de Motorista</span>
            </h4>
            <p className='text-base text-gray-700'>
                Este comando é usado para **remover** um cartão RFID específico da lista de motoristas autorizados na memória interna do dispositivo.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    802|{'{ID_DO_CARTAO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>ID\_DO\_CARTAO:</span> O número de identificação do cartão RFID a ser removido. <span className='text-red-600 font-semibold'>(Valor Máximo: {MAX_VALUE_DESCRIPTION} ou {MAX_HEX_DIGITS} dígitos hexadecimais)</span>
                    </p>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <Input
                        type="text"
                        value={cardID}
                        onChange={(e) => updateCommand(e.target.value)}
                        placeholder={`Insira um ID aqui (Máx. ${MAX_HEX_DIGITS} dígitos HEX)`}
                        className="p-2 text-sm font-mono flex-grow"
                        maxLength={MAX_HEX_DIGITS} 
                    />
                    <Badge className='bg-gray-200 text-gray-700 hover:bg-gray-200 text-xs'>
                        {cardID.length} / {MAX_HEX_DIGITS}
                    </Badge>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} {cardID.length > 0 && `// Remove o cartão de ID ${cardID}`}
                    </pre>
                </div>
            </div>
            <div className='space-y-2 pt-4 border-t border-red-200'>
                <p className="font-semibold text-gray-800">Retorno do Módulo</p>
                <p className='text-sm text-gray-700'>
                    O módulo responderá confirmando a ação. O último parâmetro indica o resultado: 
                    <span className='font-bold text-green-700'> 1 para sucesso (cartão removido)</span> ou 
                    <span className='font-bold text-red-700'> 0 para erro (cartão não encontrado ou erro)</span>.
                </p>
                <pre className='bg-gray-100 p-3 rounded-lg border text-sm font-mono whitespace-pre-wrap'>
                    GTSL|8|1|2|802|12345678|1|
                </pre>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 3: DETALHE DO COMANDO RS232 703 (CONFIGURAR BLOQUEIO)
// ----------------------------------------------------------------------

const Command803Details = () => {
    // Comando 703: Configurar Saída de Bloqueio
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('803|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`803|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Lock className='w-5 h-5' />
                <span>Comando 803 - Configurar Saída de Bloqueio</span>
            </h4>
            <p className='text-base text-gray-700'>
                Controla o comportamento da saída digital, geralmente usada para o bloqueio do motor do veículo.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    803|{'{AÇÃO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Saída/bloqueio desligada.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Antifurto ativo (liberado pela lista de cartões).</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>2:</span> Antifurto parcial (qualquer cartão libera).</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>3:</span> Saída/bloqueio sempre ativa.</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Saída/bloqueio desligada</option>
                        <option value="1">1: Antifurto ativo (liberado pela lista de cartões)</option>
                        <option value="2">2: Antifurto parcial (qualquer cartão libera)</option>
                        <option value="3">3: Saída/bloqueio sempre ativa</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '0'}
                        {mode === '1'}
                        {mode === '2'}
                        {mode === '3'}
                    </pre>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 4: DETALHE DO COMANDO RS232 704 (CONSULTAR QUANTIDADE DE CARTÕES)
// ----------------------------------------------------------------------

const Command804Details = () => {
    // Comando 704: Consultar Quantidade de Cartões
    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <List className='w-5 h-5' />
                <span>Comando 804 - Consultar Quantidade de Cartões</span>
            </h4>
            <p className='text-base text-gray-700'>
                Solicita ao dispositivo a quantidade total de cartões que estão atualmente cadastrados em sua memória.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    804|0|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p><span className='font-bold'>0:</span> Parâmetro fixo, indica o tipo de solicitação.</p>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Saída/bloqueio desligada</option>
                        <option value="1">1: Antifurto ativo (liberado pela lista de cartões)</option>
                        <option value="2">2: Antifurto parcial (qualquer cartão libera)</option>
                        <option value="3">3: Saída/bloqueio sempre ativa</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '0'}
                        {mode === '1'}
                        {mode === '2'}
                        {mode === '3'}
                    </pre>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 5: DETALHE DO COMANDO RS232 706 (AÇÃO AO DESLIGAR O VEÍCULO)
// ----------------------------------------------------------------------

const Command806Details = () => {
    // Comando 706: Ação ao Desligar o Veículo
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('806|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`806|${finalVal}|`);
        setMode(finalVal);
    }, []);
    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <PowerOff className='w-5 h-5' />
                <span>Comando 806 - Ação ao Desligar o Veículo</span>
            </h4>
            <p className='text-base text-gray-700'>
                Configura como a jornada de trabalho será finalizada quando o veículo for desligado.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    806|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Finalização de jornada automática.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Finalização de jornada apenas através da identificação (passando o cartão novamente).</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Finalização de jornada automática</option>
                        <option value="1">1: inalização de jornada apenas através da identificação </option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '0'}
                        {mode === '1'}
                    </pre>
                </div>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// COMPONENTE 6: DETALHE DO COMANDO RS232 707 (APAGAR TODOS)
// ----------------------------------------------------------------------

const Command807Details = () => {
    // Comando 707: Apagar Todos os Cartões
    return (
        <div className='p-4 border border-blue-500/50 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Zap className='w-5 h-5' />
                <span>Comando 807 - Apagar Todos os Cartões</span>
            </h4>
            <p className='text-base text-gray-700'>
                Este comando executa a limpeza completa da memória do dispositivo, removendo todos os cartões cadastrados.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    807|0|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    807|0| // Envia o comando para apagar a memória
                </pre>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// COMPONENTE 7: DETALHE DO COMANDO RS232 708 (CONSULTAR CARTÃO ESPECÍFICO)
// ----------------------------------------------------------------------

const Command808Details = () => {
    // Comando 708: Consultar Cartão Específico
    const [cardID, setCardID] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('808|{ID_DO_CARTAO}|');

    const updateCommand = useCallback((id) => {
        const upperCaseID = id.toUpperCase();
        const cleanID = upperCaseID.replace(/[^0-9A-F]/g, '');
        const finalID = cleanID.slice(0, MAX_HEX_DIGITS);
        
        if (finalID.length === 0) {
            setCommandSyntax('808|{ID_DO_CARTAO}|');
        } else {
            setCommandSyntax(`808|${finalID}|`);
        }
        setCardID(finalID);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Search className='w-5 h-5' />
                <span>Comando 808 - Consultar Cartão Específico</span>
            </h4>
            <p className='text-base text-gray-700'>
                Verifica se um cartão específico já está cadastrado na memória do dispositivo.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    808|{'{ID_DO_CARTAO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>ID\_DO\_CARTAO:</span> O número do cartão que deseja consultar.
                    </p>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <Input
                        type="text"
                        value={cardID}
                        onChange={(e) => updateCommand(e.target.value)}
                        placeholder={`Insira um ID aqui (Máx. ${MAX_HEX_DIGITS} dígitos HEX)`}
                        className="p-2 text-sm font-mono flex-grow"
                        maxLength={MAX_HEX_DIGITS} 
                    />
                    <Badge className='bg-gray-200 text-gray-700 hover:bg-gray-200 text-xs'>
                        {cardID.length} / {MAX_HEX_DIGITS}
                    </Badge>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} {cardID.length > 0 && `// Consulta o cartão de ID ${cardID}`}
                    </pre>
                </div>
            </div>
            <div className='space-y-2 pt-4 border-t border-teal-200'>
                <p className="font-semibold text-gray-800">Retorno do Módulo</p>
                <p className='text-sm text-gray-700'>
                    O último parâmetro da resposta indica o status: 
                    <span className='font-bold text-red-700'> 0 para cartão não cadastrado</span> e 
                    <span className='font-bold text-green-700'> 1 para cartão já cadastrado</span>.
                </p>
                <pre className='bg-gray-100 p-3 rounded-lg border text-sm font-mono whitespace-pre-wrap'>
                    GTSL|8|1|2|808|123456789|1|
                </pre>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 8: DETALHE DO COMANDO RS232 709 (CONFIGURAR TIMEOUT)
// ----------------------------------------------------------------------

const Command809Details = () => {
    // Comando 709: Configurar Timeout de Identificação
    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('809|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = cleanVal;

        // Regra de máximo de 1800 segundos
        if (parseInt(cleanVal, 10) > MAX_SECONDS_601) {
            finalVal = MAX_SECONDS_601.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '0';
        }
        
        setCommandSyntax(`809|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 809 - Configurar Timeout de Identificação</span>
            </h4>
            <p className='text-base text-gray-700'>
                Define o tempo máximo, em segundos, que o motorista tem para se identificar com o cartão após ligar a ignição. Se o tempo expirar, um evento de timeout é gerado.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    809|{'{SEGUNDOS}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>SEGUNDOS:</span> Tempo limite em segundos. Para desativar o timeout, configure o valor como **0**. 
                        <span className='font-semibold text-red-600'>(Valor Máximo: {MAX_SECONDS_601} segundos)</span>.
                    </p>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <Input
                        type="number"
                        value={seconds}
                        onChange={(e) => updateCommand(e.target.value)}
                        placeholder={`Tempo em segundos (Máx. ${MAX_SECONDS_601})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_SECONDS_601} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Desativa o timeout`
                            : `// Define o tempo de espera para ${commandSyntax.split('|')[1]} segundos`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command810Details = () => {
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('810|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`810|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 810 - Identificação por RFID para os botões de jornada.</span>
            </h4>
            <p className='text-base text-gray-700'>
                Ativa ou desativa a Identificação por RFID para os botões de jornada.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    810|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Botões de jornada sem identificação. </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Botões de jornada com identificação.</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0:Botões de jornada sem identificação.</option>
                        <option value="1">1: Botões de jornada com identificação.</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '1' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command811Details = () => {
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('811|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`811|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 811 - Antifurto por RFID com os botões de jornada.</span>
            </h4>
            <p className='text-base text-gray-700'>
                Quanto ligado o antifurto via botões de jornada, o antifurto via ignicao é desligado automaticamente. 
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    811|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span>  Antifurto via botões de jornada desligado. </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Antifurto via botões de jornada ligado.</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Antifurto via botões de jornada desligado.</option>
                        <option value="1">1: Antifurto via botões de jornada ligado.</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '1' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command812Details = () => {
    // Comando 812: Acionar Alerta Sonoro (Buzzer)
    const MAX_BEEPS = 20;
    const [beeps, setBeeps] = useState('1');
    const [commandSyntax, setCommandSyntax] = useState('812|1|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = parseInt(cleanVal, 10);

        if (finalVal < 1 || cleanVal.length === 0) {
            finalVal = 1;
        } else if (finalVal > MAX_BEEPS) {
            finalVal = MAX_BEEPS;
        }
        
        setCommandSyntax(`812|${finalVal}|`);
        setBeeps(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <BellRing className='w-5 h-5' />
                <span>Comando 812 - Acionar Alerta Sonoro (Buzzer)</span>
            </h4>
            <p className='text-base text-gray-700'>
                Ativa o buzzer interno do dispositivo para emitir um alerta sonoro. É útil para testar o buzzer ou para notificar o motorista sobre um comando recebido.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    812|{'{VEZES}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>VEZES:</span> Número de vezes que o buzzer irá bipa (valor de 1 a {MAX_BEEPS}).
                    </p>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <Input
                        type="number"
                        value={beeps}
                        onChange={(e) => updateCommand(e.target.value)}
                        placeholder={`Número de bips (1 a ${MAX_BEEPS})`}
                        className="p-2 text-sm font-mono flex-grow"
                        min={1} 
                        max={MAX_BEEPS} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {`// O buzzer bipará ${commandSyntax.split('|')[1]} vezes`}
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command813Details = () => {
    // Comando 813: Reset de Fábrica
    return (
        <div className='p-4 border border-blue-400 rounded-lg bg-blue-100 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Settings className='w-5 h-5' />
                <span>Comando 813 - Reset de Fábrica</span>
            </h4>
            <p className='text-base text-gray-700'>
                Restaura todas as configurações do módulo para os padrões originais de fábrica.
                <span className='font-semibold text-red-600 block mt-2'>Isso não apaga a lista de cartões cadastrados (para isso, use o comando 807).</span>
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    813|0|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    813|0| // Restaura as configurações
                </pre>
            </div>
        </div>
    );
};

const Command814Details = () => {
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('814|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`814|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 814 - Identificação via ignição e antifurto.</span>
            </h4>
            <p className='text-base text-gray-700'>
                O modo de trabalho deve ser configurado via comando 803            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    814|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span>  Identificação via ignição e antifurto desligados. </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Identificação via ignição e antifurto ligados.</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Identificação via ignição e antifurto desligados.</option>
                        <option value="1">1: Identificação via ignição e antifurto ligados.</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '1' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command815Details = () => {
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('815|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-2]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`815|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 815 - Função botão cadeado.</span>
            </h4>
            <p className='text-base text-gray-700'>
                Atribiu uma função para o botão cadeado.         </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    815|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span>  Desabilitado. </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Login/logout do ajudante/segundo motorista via botão cadeado.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>2:</span> Identificação de passageiros via botão cadeado.</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Desabilitado.</option>
                        <option value="1">1: Login/logout do ajudante/segundo motorista via botão cadeado.</option>
                        <option value="2">2: Identificação de passageiros via botão cadeado.</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '2' }
                        {mode === '1' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};


const Command817Details = () => {
    // Comando 817: Alterar Protocolo de Comunicação
    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Shuffle className='w-5 h-5' />
                <span>Comando 817 - Alterar Protocolo de Comunicação</span>
            </h4>
            <p className='text-base text-gray-700'>
                Permite alterar o formato da string de comunicação para garantir compatibilidade com diferentes plataformas de rastreamento.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    817|{'{PROTOCOLO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Protocolo Padrão.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Protocolo GV300.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>2:</span> Protocolo GV75.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>4:</span> Protocolo GV300CAN.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>5:</span> Protocolo  Continental VDO.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>6:</span> Protocolo GV75M.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>8:</span> Protocolo GV350CEU.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>9:</span> Protocolo GV350M.</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    817|8| // Altera a comunicação para o padrão do GV350CEU
                </pre>
            </div>
        </div>
    );
};

const Command818Details = () => {
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('818|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-6]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`818|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 818 - Modo de funcionamento.</span>
            </h4>
            <p className='text-base text-gray-700'>
                Modo de funcionamento para o teclado controle de jornada.         </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    818|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Botões de jornada com uso livre. </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Botões de jornada liberados apenas na alteração da ignicao.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>2:</span> Botões de jornada liberados apenas com ignição ligada. </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>3:</span> Todos os botoes liberados apenas com ingnição ligada.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>4:</span> Botoes de jornada com uso livre e 2 motoristas.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>5:</span> Modo sem restrições.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>6:</span> Uso livre com alerta de Jornada desligada.</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Botões de jornada com uso livre.</option>
                        <option value="1">1: Botões de jornada liberados apenas na alteração da ignicao.</option>
                        <option value="2">2: Botões de jornada liberados apenas com ignição ligada. .</option>
                        <option value="3">3: Todos os botoes liberados apenas com ingnição ligada.</option>
                        <option value="4">4: Botoes de jornada com uso livre e 2 motoristas.</option>
                        <option value="5">5: Modo sem restrições.</option>
                        <option value="6">6: Uso livre com alerta de Jornada desligada.</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax}
                        {mode === '6' }
                        {mode === '5' }
                        {mode === '4' } 
                        {mode === '3' }
                        {mode === '2' }
                        {mode === '1' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command819Details = () => {
    const [mode, setMode] = useState('1');
    const [commandSyntax, setCommandSyntax] = useState('819|1|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^1-2]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`819|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 819 - Controle Saída.</span>
            </h4>
            <p className='text-base text-gray-700'>
                Controle Saída 02/Trava Baú (fio laranja).         </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    819|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> saída ativa / trava bau liberada.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>2:</span> saída desligada / trava báu trancada.</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="1">1: saída ativa / trava bau liberada.</option>
                        <option value="2">2: saída desligada / trava báu trancada .</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '2' }
                        {mode === '1' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command821Details = () => {
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('821|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-4]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`821|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 821 - Modo de funcionamento.</span>
            </h4>
            <p className='text-base text-gray-700'>
                Modo de funcionamento para o teclado controle de jornada.         </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    821|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Botões desligados. </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Um digito.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>2:</span> Dois digitos. </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>3:</span> Tres digitos.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>4:</span> Quatro digitos - padrão .</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Botões desligados.</option>
                        <option value="1">1: Um digito.</option>
                        <option value="2">2: Dois digitos. .</option>
                        <option value="3">3: Tres digitos.</option>
                        <option value="4">4: Quatro digitos - padrão .</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax}
                        {mode === '4' } 
                        {mode === '3' }
                        {mode === '2' }
                        {mode === '1' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command822Details = () => {
    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('822|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = cleanVal;

        // Regra de máximo de 1800 segundos
        if (parseInt(cleanVal, 10) > MAX_SECONDS_601) {
            finalVal = MAX_SECONDS_601.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '0';
        }
        
        setCommandSyntax(`822|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 822 - Delay de envio do protocolo ao ligar a ignição</span>
            </h4>
            <p className='text-base text-gray-700'>
                Segundos que o GS-601 deve aguardar antes de enviaro protocolo ao ligar a ignição. Esta função é util para aguardar o rastreador identificar
                a ignição ligada e habiligar a porta RS232 em casos que o rastreador entra em economia de energia. 
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    822|{'{SEGUNDOS}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>SEGUNDOS:</span> Tempo limite em segundos. 
                        <span className='font-semibold text-red-600'>(Valor Máximo: {MAX_SECONDS_601} segundos)</span>.
                    </p>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <Input
                        type="number"
                        value={seconds}
                        onChange={(e) => updateCommand(e.target.value)}
                        placeholder={`Tempo em segundos (Máx. ${MAX_SECONDS_601})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_SECONDS_601} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Define o tempo de delay para ${commandSyntax.split('|')[1]} segundos`
                            : `// Define o tempo de delay para ${commandSyntax.split('|')[1]} segundos`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command823Details = () => {
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('823|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`823|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 823 - Alerta de trava baú.</span>
            </h4>
            <p className='text-base text-gray-700'>
                Ativa o alerta de trava baú aberta na tentativa de ligar o veículo.         </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    823|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> saída desligada / trava báu trancada.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Alerta ativo – padrão quando o controle de trava báu estiver ativo .</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Alerta ativo – padrão quando o controle de trava báu estiver ativo .</option>
                        <option value="1">1: saída desligada / trava báu trancada .</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '1' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command824Details = () => {
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('824|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`824|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 824 - Envio do protocolo quando cartão não autorizado.</span>
            </h4>
            <p className='text-base text-gray-700'>
                Ativa o envio do protocolo quando cartão não autorizado.         </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    824|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> sEnvio não ativo – padrão.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Envio ativo.</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Envio não ativo – padrão .</option>
                        <option value="1">1: Envio ativo.</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '1' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command825Details = () => {
    
    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('825|1|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = cleanVal;

        // Regra de máximo de 30 segundos
        if (parseInt(cleanVal, 10) > IG_SECONDS_601) {
            finalVal = IG_SECONDS_601.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '1';
        }
        
        setCommandSyntax(`825|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 825 - Delay de Ignição Ligada</span>
            </h4>
            <p className='text-base text-gray-700'>
                Define um atraso, em segundos, para que o sistema considere a ignição como "ligada", evitando falsos positivos.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    728|{'{SEGUNDOS}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>SEGUNDOS:</span> Tempo de atraso em segundos. 
                        <span className='font-semibold text-red-600'>(Valor Máximo: {IG_SECONDS_601} segundos, Valor Mínimo : 1 segundo)</span>.
                    </p>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <Input
                        type="number"
                        value={seconds}
                        onChange={(e) => updateCommand(e.target.value)}
                        placeholder={`Tempo em segundos (Máx. ${IG_SECONDS_601})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={IG_SECONDS_601} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Define o tempo de atraso para ${commandSyntax.split('|')[1]} segundos`
                            : `// Define o tempo de atraso para ${commandSyntax.split('|')[1]} segundos`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command826Details = () => {
    
    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('826|1|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = cleanVal;

        // Regra de máximo de 30 segundos
        if (parseInt(cleanVal, 10) > IG_SECONDS_601) {
            finalVal = IG_SECONDS_601.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '1';
        }
        
        setCommandSyntax(`826|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 826 - Delay de Ignição Desligada</span>
            </h4>
            <p className='text-base text-gray-700'>
                Define um atraso, em segundos, para que o sistema considere a ignição como "desligada". O valor padrão é 3 segundos.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    826|{'{SEGUNDOS}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>SEGUNDOS:</span> Tempo de atraso em segundos. 
                        <span className='font-semibold text-red-600'>(Valor Máximo: {IG_SECONDS_601} segundos, Valor Mínimo : 1 segundo)</span>.
                    </p>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <Input
                        type="number"
                        value={seconds}
                        onChange={(e) => updateCommand(e.target.value)}
                        placeholder={`Tempo em segundos (Máx. ${IG_SECONDS_601})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={IG_SECONDS_601} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Define o tempo  de atraso para ${commandSyntax.split('|')[1]} segundos`
                            : `// Define o tempo  de atraso para ${commandSyntax.split('|')[1]} segundos`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command827Details = () => {
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('827|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`827|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 827 - Serial transparente.</span>
            </h4>
            <p className='text-base text-gray-700'>
                Ativa Serial transparente (usada para ligar mais de um dispositivo na mesma serial)        </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    827|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Função desativada.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Função ativada .</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Função desativada .</option>
                        <option value="1">1: Função ativada .</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '1' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command828Details = () => {
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('828|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`828|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 828 - Bloqueio pelo botao de jornada.</span>
            </h4>
            <p className='text-base text-gray-700'>
                Desligar o bloqueio pelo botao de jornada no modo livre        </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    828|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Função desativada.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Função ativada .</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Função desativada .</option>
                        <option value="1">1: Função ativada .</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '1' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command829Details = () => {
    
    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('829|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = cleanVal;

        // Regra de máximo de 30 segundos
        if (parseInt(cleanVal, 10) > IG_SECONDS_601) {
            finalVal = IG_SECONDS_601.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '1';
        }
        
        setCommandSyntax(`829|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 829 - Timeout da Manobra</span>
            </h4>
            <p className='text-base text-gray-700'>
                Define um tempo limite de manobra ativa
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    829|{'{SEGUNDOS}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>SEGUNDOS:</span> Tempo de limite em segundos. 
                        <span className='font-semibold text-red-600'>(Valor Máximo: {IG_SECONDS_601} segundos)</span>.
                    </p>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <Input
                        type="number"
                        value={seconds}
                        onChange={(e) => updateCommand(e.target.value)}
                        placeholder={`Tempo em segundos (Máx. ${IG_SECONDS_601})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={IG_SECONDS_601} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Define o tempo  tempo limite para ${commandSyntax.split('|')[1]} segundos`
                            : `// Define o tempo  tempo limite para ${commandSyntax.split('|')[1]} segundos`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command830Details = () => {
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('830|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`830|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 830 - Uso do botão manobra.</span>
            </h4>
            <p className='text-base text-gray-700'>
                Uso do botão manobra a qualquer momento         </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    830|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Função desativada.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Função ativada .</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Função desativada .</option>
                        <option value="1">1: Função ativada .</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '1' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command832Details = () => {
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('832|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`832|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 832 - Pacote de manobra com Jornada ativa.</span>
            </h4>
            <p className='text-base text-gray-700'>
                Desabilita o envio do pacote de manobra com Jornada ativa         </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    832|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Função desativada.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Função ativada .</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Função desativada .</option>
                        <option value="1">1: Função ativada .</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '1' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command833Details = () => {
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('833|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`833|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 833 - Solicitar RFID nos botões Função.</span>
            </h4>
            <p className='text-base text-gray-700'>
                Solicitar RFID nos botões Função (1, 2 e 3)         </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    833|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Função desativada.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Função ativada .</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Função desativada .</option>
                        <option value="1">1: Função ativada .</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '1' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command835Details = () => {
    const [mode, setMode] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('835|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-2]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`835|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-400 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Nfc  className='w-5 h-5' />
                <span>Comando 835 – Frequência do RFID</span>
            </h4>
            <p className='text-base text-gray-700'>
                Configura qual tecnologia de leitura RFID o módulo irá utilizar.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    835|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Dupla Frequência, 125Khz e 13.56Mhz (Padrão).</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Apenas 125Khz.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>2:</span> Apenas 13.56Mhz Mifare.</p>
                    </div>
                    
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: Dupla Frequência, 125Khz e 13.56Mhz (Padrão).</option>
                        <option value="1">1: Apenas 125Khz</option>
                        <option value="2">2: Apenas 13.56Mhz Mifare.</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '0'}
                        {mode === '1'}
                        {mode === '2'}
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command837Details = () => {
    const [mode, setMode] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('837|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1-2]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`837|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-400 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Repeat className='w-5 h-5' />
                <span>Comando 837 - Configurar Baudrate</span>
            </h4>
            <p className='text-base text-gray-700'>
                Ajusta a velocidade da comunicação serial (taxa de transmissão) para se adequar ao dispositivo rastreador conectado.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    837|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> 19200 bps (Padrão).</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> 115200 bps</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>2:</span> 9600 bps</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg"
                    >
                        <option value="0">0: 19200 bps</option>
                        <option value="1">1: 115200 bps</option>
                        <option value="2">2: 9600 bps</option>
                    </select>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '0'}
                        {mode === '1'}
                        {mode === '2'}
                    </pre>
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

  // Lista de comandos disponíveis para seleção (ATUALIZADA E VERIFICADA)
  const COMMAND_OPTIONS = [
    { id: '801', name: 'Comando 801 - Cadastro de Motorista (1 ID)', Component: Command801Details },
    { id: '803', name: 'Comando 803 - Configurar Saída de Bloqueio', Component: Command803Details },
    { id: '804', name: 'Comando 804 - Consultar Quantidade de Cartões', Component: Command804Details },
    { id: '806', name: 'Comando 806 - Ação ao Desligar o Veículo', Component: Command806Details },
    { id: '807', name: 'Comando 807 - Apagar Todos os Cartões', Component: Command807Details },
    { id: '808', name: 'Comando 808 - Consultar Cartão Específico', Component: Command808Details },
    { id: '809', name: 'Comando 809 - Configuração do timeout de identificação', Component: Command809Details },
    { id: '810', name: `Comando 810 - Identificação por RFID para os botões de jornada`, Component: Command810Details }, 
    { id: '811', name: 'Comando 811 - Antifurto por RFID com os botões de jornada', Component: Command811Details },
    { id: '812', name: 'Comando 812 - Alerta Sonoro', Component: Command812Details },
    { id: '813', name: 'Comando 813 - Reset de Fábrica', Component: Command813Details },
    { id: '817', name: 'Comando 817 - Alterar Protocolo de Comunicação', Component: Command817Details }, 
    { id: '818', name: 'Comando 818 - Modo de funcionamento', Component: Command818Details }, 
    { id: '819', name: 'Comando 819 - Controle Saída 02/Trava Baú', Component: Command819Details }, 
    { id: '821', name: 'Comando 821 - Tamanho do código de macro simples', Component: Command821Details }, 
    { id: '822', name: 'Comando 822 - Delay de envio do protocolo ao ligar a ignição', Component: Command822Details },
    { id: '823', name: 'Comando 823 - Alerta de trava baú aberta', Component: Command823Details },
    { id: '824', name: 'Comando 824 - Envio do protocolo quando cartão não autorizado', Component: Command824Details },
    { id: '825', name: 'Comando 825 – Delay de Ignição Ligada', Component: Command825Details },
    { id: '826', name: 'Comando 826 – Delay de Ignição Desligada', Component: Command826Details },
    { id: '827', name: 'Comando 827 – Serial transparente', Component: Command827Details },
    { id: '828', name: 'Comando  828 – Bloqueio pelo botao de jornada', Component: Command828Details },
    { id: '829', name: 'Comando  829 – Timeout da Manobra', Component: Command829Details },
    { id: '830', name: 'Comando  830 – Uso do botão manobra a qualquer momento', Component: Command830Details },
    { id: '832', name: 'Comando  832 – Desabilita o envio do pacote de manobra com Jornada ativa', Component: Command832Details },
    { id: '833', name: 'Comando  833 – Solicitar RFID nos botões Função', Component: Command833Details },
    { id: '835', name: 'Comando  835 – Frequencia do RFID', Component: Command835Details },
    { id: '837', name: 'Comando  837 – Baudrate da Serial', Component: Command837Details },
    
  ];
  const [selectedCommand, setSelectedCommand] = useState(COMMAND_OPTIONS[0]); 

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
                {/* Mantenho a imagem do logo conforme o original */}
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

     

      {/* Comandos RS232 Section */}
      <section id="comandos" className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-4">
              Documentação Técnica
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Comandos RS232 para Gs-601
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
                Consulte a sintaxe e os detalhes dos comandos de configuração.
            </p>
            
          </div>
          
          {/* CONTAINER PRINCIPAL E SELETOR DE COMANDOS */}
          <div className="bg-white p-6 rounded-xl w-full max-w-4xl mx-auto shadow-xl border border-gray-200">
            
            {/* TÍTULO DA SUBSEÇÃO E INSTRUÇÃO */}
            <div className="text-center mb-6 border-b pb-4">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center justify-center space-x-2">
                    Detalhe dos Comandos de Configuração
                </h3>
                <p className='text-sm text-gray-500 mt-2'>
                    Selecione um comando abaixo para visualizar sua sintaxe e exemplos.
                </p>
            </div>
            
            {/* CAMPO DE BUSCA/SELETOR */}
            <div className="mb-8 w-full max-w-lg mx-auto">
                <select 
                    className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base"
                    value={selectedCommand ? selectedCommand.id : ''}
                    onChange={(e) => {
                        const commandId = e.target.value;
                        const command = COMMAND_OPTIONS.find(opt => opt.id === commandId);
                        setSelectedCommand(command);
                    }}
                >
                    <option value="" disabled>-- Selecione um Comando RS232 --</option>
                    {COMMAND_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                </select>
            </div>

            {/* RENDERIZAÇÃO CONDICIONAL DO COMANDO SELECIONADO */}
            <div className='w-full'>
                {selectedCommand ? (
                    // Renderiza o componente correspondente ao comando selecionado
                    <selectedCommand.Component />
                ) : (
                    // Mensagem inicial
                    <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border-dashed border-2 border-gray-200">
                        <p className='font-medium'>
                            Use o seletor acima para encontrar a documentação do comando desejado.
                        </p>
                    </div>
                )}
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
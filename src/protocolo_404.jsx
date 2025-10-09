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
  MessageCircle // NOVO: Ícone para 723 (Replicação RS232)
} from 'lucide-react';
import Logo from './assets/logo.png'


// ----------------------------------------------------------------------
// CONSTANTES DE COMANDO
// ----------------------------------------------------------------------
const whatsappNumber = '5541991676700'; // Formato internacional sem caracteres especiais
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico sobre produtos e ligações.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

// Limite de 0xFFFFFFFF (8 dígitos hexadecimais)
const MAX_HEX_DIGITS = 10;
const MAX_VALUE_DESCRIPTION = '0xFFFFFFFF';
// Limite de segundos para o comando 709 (Regra anterior)
const MAX_SECONDS_VALUE = 45000; 
// Limite de cartões para o comando 710
const MAX_CARDS_710 = 10;


// ----------------------------------------------------------------------
// COMPONENTE 1: DETALHE DO COMANDO RS232 701 (CADASTRO DE CARTÃO)
// ----------------------------------------------------------------------

const Command701Details = () => {
    // Comando 701: Cadastro de Motorista (Adicionar)
    const [cardID, setCardID] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('701|{ID_DO_CARTAO}|');

    const updateCommand = useCallback((id) => {
        const upperCaseID = id.toUpperCase();
        const cleanID = upperCaseID.replace(/[^0-9A-F]/g, '');
        const finalID = cleanID.slice(0, MAX_HEX_DIGITS);
        
        if (finalID.length === 0) {
            setCommandSyntax('701|{ID_DO_CARTAO}|');
        } else {
            setCommandSyntax(`701|${finalID}|`);
        }
        setCardID(finalID);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 701 - Cadastro de Motorista</span>
            </h4>
            <p className='text-base text-gray-700'>
                Este comando é usado para **adicionar** um novo cartão RFID à lista de motoristas autorizados na memória interna do dispositivo.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    701|{'{ID_DO_CARTAO}'}|
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
                        placeholder={`Insira um ID aqui (Máx. ${MAX_HEX_DIGITS} dígitos)`}
                        className="p-2 text-sm font-mono flex-grow"
                        maxLength={MAX_HEX_DIGITS} 
                    />
                    <Badge className='bg-gray-200 text-gray-700 hover:bg-gray-200 text-xs'>
                        {cardID.length} / {MAX_HEX_DIGITS}
                    </Badge>
                </div>
                <p className="font-semibold text-gray-800">Comando</p>
                <div className='flex items-center space-x-2'>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
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
                    GTSL|7|1|2|701|123456|1|
                </pre>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 2: DETALHE DO COMANDO RS232 702 (REMOÇÃO DE CARTÃO)
// ----------------------------------------------------------------------

const Command702Details = () => {
    // Comando 702: Remoção de Motorista (Remover) - Baseado no padrão dos outros comandos
    const [cardID, setCardID] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('702|{ID_DO_CARTAO}|');

    const updateCommand = useCallback((id) => {
        const upperCaseID = id.toUpperCase();
        const cleanID = upperCaseID.replace(/[^0-9A-F]/g, '');
        const finalID = cleanID.slice(0, MAX_HEX_DIGITS);
        
        if (finalID.length === 0) {
            setCommandSyntax('702|{ID_DO_CARTAO}|');
        } else {
            setCommandSyntax(`702|${finalID}|`);
        }
        
        setCardID(finalID);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Trash2 className='w-5 h-5' />
                <span>Comando 702 - Remoção de Motorista</span>
            </h4>
            <p className='text-base text-gray-700'>
                Este comando é usado para **remover** um cartão RFID específico da lista de motoristas autorizados na memória interna do dispositivo.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    702|{'{ID_DO_CARTAO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>ID\_DO\_CARTAO:</span> O número de identificação do cartão RFID a ser removido.</p>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <Input
                        type="text"
                        value={cardID}
                        onChange={(e) => updateCommand(e.target.value)}
                        placeholder={`Insira um ID aqui (Máx. ${MAX_HEX_DIGITS} dígitos)`}
                        className="p-2 text-sm font-mono flex-grow"
                        maxLength={MAX_HEX_DIGITS} 
                    />
                    <Badge className='bg-gray-200 text-gray-700 hover:bg-gray-200 text-xs'>
                        {cardID.length} / {MAX_HEX_DIGITS}
                    </Badge>
                 </div>
                <p className="font-semibold text-gray-800">Comando</p>
                <div className='flex items-center space-x-2'>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
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
                    GTSL|7|1|2|702|12345678|1|
                </pre>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 3: DETALHE DO COMANDO RS232 703 (CONFIGURAR BLOQUEIO)
// ----------------------------------------------------------------------

const Command703Details = () => {
    // Comando 703: Configurar Saída de Bloqueio
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('703|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-4]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`703|${finalVal}|`);
        setMode(finalVal);
    }, []);
    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Lock className='w-5 h-5' />
                <span>Comando 703 - Configurar Saída de Bloqueio</span>
            </h4>
            <p className='text-base text-gray-700'>
                Controla o comportamento da saída digital, geralmente usada para o bloqueio do motor do veículo.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    703|{'{AÇÃO}'}|
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
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>4:</span> Pulso de bloqueio na identificação de passageiros.</p>
                    </div>
                </div>
            </div>
            <div className=' space-y-2'>
                <p className="flex font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="flex p-2 text-sm font-mono border truncate min-w-0 rounded-lg"
                    >
                        <option value="0">0: Desativado</option>
                        <option value="1">1: Ativo (Ignição Ligada)</option>
                        <option value="2">2: Ativo (Ignição Ligada ou Desligada)</option>
                        <option value="3">3: Saída/bloqueio sempre ativa</option>
                        <option value="4">4: Pulso de bloqueio na identificação de passageiros</option>
                    </select>
                    </div>
                    <p className="font-semibold text-gray-800">Comando</p>
                    <div className='flex items-center space-x-2'>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '0' }
                        {mode === '1' }
                        {mode === '2' }
                        {mode === '3' }
                        {mode === '4' }
                    </pre>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 4: DETALHE DO COMANDO RS232 704 (CONSULTAR QUANTIDADE DE CARTÕES)
// ----------------------------------------------------------------------

const Command704Details = () => {
    // Comando 704: Consultar Quantidade de Cartões
    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <List className='w-5 h-5' />
                <span>Comando 704 - Consultar Quantidade de Cartões</span>
            </h4>
            <p className='text-base text-gray-700'>
                Solicita ao dispositivo a quantidade total de cartões que estão atualmente cadastrados em sua memória.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    704|0|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p><span className='font-bold'>0:</span> Parâmetro fixo, indica o tipo de solicitação.</p>
                </div>
            </div>
            <div className='space-y-2 pt-4 border-t border-orange-200'>
                <p className="font-semibold text-gray-800">Retorno do Módulo</p>
                <p className='text-sm text-gray-700'>
                    A resposta incluirá o número de cartões cadastrados. No exemplo, **15** indica 15 cartões na memória.
                </p>
                <pre className='bg-gray-100 p-3 rounded-lg border text-sm font-mono whitespace-pre-wrap'>
                    GTSL|7|1|2|704|15|1|
                </pre>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 5: DETALHE DO COMANDO RS232 706 (AÇÃO AO DESLIGAR O VEÍCULO)
// ----------------------------------------------------------------------

const Command706Details = () => {
    // Comando 706: Ação ao Desligar o Veículo
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('706|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-2]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`706|${finalVal}|`);
        setMode(finalVal);
    }, []);
    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <PowerOff className='w-5 h-5' />
                <span>Comando 706 - Ação ao Desligar o Veículo</span>
            </h4>
            <p className='text-base text-gray-700'>
                Configura como a jornada de trabalho será finalizada quando o veículo for desligado.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    706|{'{MODO}'}|
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
                        className="p-2 text-sm font-mono flex-grow border rounded-lg truncate min-w-0"
                    >
                        <option value="0">0: Finalização de jornada automática</option>
                        <option value="1">1: Finalização de jornada apenas através da identificação</option>
                    </select>
                    </div>
<p className="font-semibold text-gray-800">Comando</p>
<div className='flex items-center space-x-2'>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '0' }
                        {mode === '1' }
                    </pre>
                </div>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// COMPONENTE 6: DETALHE DO COMANDO RS232 707 (APAGAR TODOS)
// ----------------------------------------------------------------------

const Command707Details = () => {
    // Comando 707: Apagar Todos os Cartões
    return (
        <div className='p-4 border border-blue-500/50 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Zap className='w-5 h-5' />
                <span>Comando 707 - Apagar Todos os Cartões</span>
            </h4>
            <p className='text-base text-gray-700'>
                Este comando executa a limpeza completa da memória do dispositivo, removendo todos os cartões cadastrados.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    707|0|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    707|0| // Envia o comando para apagar a memória
                </pre>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// COMPONENTE 7: DETALHE DO COMANDO RS232 708 (CONSULTAR CARTÃO ESPECÍFICO)
// ----------------------------------------------------------------------

const Command708Details = () => {
    // Comando 708: Consultar Cartão Específico
    const [cardID, setCardID] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('708|{ID_DO_CARTAO}|');

    const updateCommand = useCallback((id) => {
        const upperCaseID = id.toUpperCase();
        const cleanID = upperCaseID.replace(/[^0-9A-F]/g, '');
        const finalID = cleanID.slice(0, MAX_HEX_DIGITS);
        
        if (finalID.length === 0) {
            setCommandSyntax('708|{ID_DO_CARTAO}|');
        } else {
            setCommandSyntax(`708|${finalID}|`);
        }
        setCardID(finalID);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Search className='w-5 h-5' />
                <span>Comando 708 - Consultar Cartão Específico</span>
            </h4>
            <p className='text-base text-gray-700'>
                Verifica se um cartão específico já está cadastrado na memória do dispositivo.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    708|{'{ID_DO_CARTAO}'}|
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
                   </div>
                <p className="font-semibold text-gray-800">Comando</p>
                <div className='flex items-center space-x-2'>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
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
                    GTSL|7|1|2|708|123456789|1|
                </pre>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 8: DETALHE DO COMANDO RS232 709 (CONFIGURAR TIMEOUT)
// ----------------------------------------------------------------------

const Command709Details = () => {
    // Comando 709: Configurar Timeout de Identificação
    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('709|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = cleanVal;

        // Regra de máximo de 45000 segundos
        if (parseInt(cleanVal, 10) > MAX_SECONDS_VALUE) {
            finalVal = MAX_SECONDS_VALUE.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '0';
        }
        
        setCommandSyntax(`709|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 709 - Configurar Timeout de Identificação</span>
            </h4>
            <p className='text-base text-gray-700'>
                Define o tempo máximo, em segundos, que o motorista tem para se identificar com o cartão após ligar a ignição. Se o tempo expirar, um evento de timeout é gerado.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    709|{'{SEGUNDOS}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>SEGUNDOS:</span> Tempo limite em segundos. Para desativar o timeout, configure o valor como **0**. 
                        <span className='font-semibold text-red-600'>(Valor Máximo: {MAX_SECONDS_VALUE} segundos)</span>.
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
                        placeholder={`Tempo em segundos (Máx. ${MAX_SECONDS_VALUE})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_SECONDS_VALUE} 
                    />
                    </div>
                <p className="font-semibold text-gray-800">Comando</p>
                <div className='flex items-center space-x-2'>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                    </pre>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 9: DETALHE DO COMANDO RS232 710 (ADICIONAR CARTÕES EM LOTE)
// ----------------------------------------------------------------------

const Command710Details = () => {
    // Comando 710: Adicionar Cartões em Lote (Máximo 10)
    const [cardIDs, setCardIDs] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('710|0|');

    const updateCommand = useCallback((input) => {
        const cleanIDs = input.split(',')
            .map(id => id.trim().toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, MAX_HEX_DIGITS))
            .filter(id => id.length > 0)
            .slice(0, MAX_CARDS_710); // Limita a 10 cartões
        
        const count = cleanIDs.length;
        
        if (count === 0) {
            setCommandSyntax('710|{QTD}|{ID1}|{ID2}|...');
        } else {
            setCommandSyntax(`710|${count}|${cleanIDs.join('|')}|`);
        }
        setCardIDs(input);
    }, []);

    const count = cardIDs.split(',').map(id => id.trim().replace(/[^0-9A-F]/g, '').slice(0, MAX_HEX_DIGITS)).filter(id => id.length > 0).length;

    return (
        <div className='p-4 border border-blue-300 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <List className='w-5 h-5' />
                <span>Comando 710 - Adicionar Cartões em Lote</span>
            </h4>
            <p className='text-base text-gray-700'>
                Utilizado para **adicionar múltiplos cartões** ao sistema via comunicação RS232.
                <span className='font-semibold text-red-600 block mt-1'>O limite é de {MAX_CARDS_710} cartões por comando.</span>
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    710|{'{QTD_CARTOES}'}|{'{ID1}'}|{'{ID2}'}|...|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>QTD\_CARTOES:</span> Número total de cartões a serem enviados (máximo de 10).</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>ID1, ID2, ...:</span> Os números de cada cartão a ser adicionado, separados por pipe (|).</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Simulador de Exemplo (IDs separados por vírgula)</p>
                <div className='flex items-center space-x-2'>
                    <Input
                        type="text"
                        value={cardIDs}
                        onChange={(e) => updateCommand(e.target.value)}
                        placeholder={`IDs (Ex: 1111, 2222, 3333). Máx ${MAX_CARDS_710} IDs.`}
                        className="p-2 text-sm font-mono flex-grow"
                    />
                    <Badge className='bg-gray-200 text-gray-700 hover:bg-gray-200 text-xs'>
                        {count} / {MAX_CARDS_710} IDs
                    </Badge>
                </div>
                <p className="font-semibold text-gray-800 mt-2">Comando Gerado (Exemplo: 710|2|11111|22222|):</p>
                <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    {commandSyntax}
                </pre>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 10: DETALHE DO COMANDO RS232 711 (ALTERAR PROTOCOLO)
// ----------------------------------------------------------------------

const Command711Details = () => {
    // Comando 711: Alterar Protocolo de Comunicação
    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Shuffle className='w-5 h-5' />
                <span>Comando 711 - Alterar Protocolo de Comunicação</span>
            </h4>
            <p className='text-base text-gray-700'>
                Permite alterar o formato da string de comunicação para garantir compatibilidade com diferentes plataformas de rastreamento.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    711|{'{PROTOCOLO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Protocolo GS-404.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Protocolo GS-402B.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>2:</span> Protocolo Maxtrack.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>3:</span> Protocolo Continental VDO.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>4:</span> Protocolo CalAmp + Fulltime.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>5:</span> Protocolo GV300 dado livre.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>6:</span> Protocolo GV300 dado livre 402B.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>7:</span> Protocolo GV75.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>8:</span> Envia apenas o Id do cartão .</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>10:</span> VDO Transparente.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>24:</span> Jimi JC400.</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    711|7| // Altera a comunicação para o padrão do Queclink GV75
                </pre>
            </div>
        </div>
    );
};



const Command712Details = () => {
    // Comando 712: Reset de Fábrica
    return (
        <div className='p-4 border border-blue-400 rounded-lg bg-blue-100 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Settings className='w-5 h-5' />
                <span>Comando 712 - Reset de Fábrica</span>
            </h4>
            <p className='text-base text-gray-700'>
                Restaura todas as configurações do módulo para os padrões originais de fábrica.
                <span className='font-semibold text-red-600 block mt-2'>Isso não apaga a lista de cartões cadastrados (para isso, use o comando 707).</span>
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    712|0|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    712|0| // Restaura as configurações
                </pre>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 12: DETALHE DO COMANDO RS232 716 (ACIONAR ALERTA SONORO)
// ----------------------------------------------------------------------

const Command716Details = () => {
    // Comando 716: Acionar Alerta Sonoro (Buzzer)
    const MAX_BEEPS = 10;
    const [beeps, setBeeps] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('716|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = parseInt(cleanVal, 10);

        if (finalVal < 1 || cleanVal.length === 0) {
            finalVal = 1;
        } else if (finalVal > MAX_BEEPS) {
            finalVal = MAX_BEEPS;
        }
        
        setCommandSyntax(`716|${finalVal}|`);
        setBeeps(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <BellRing className='w-5 h-5' />
                <span>Comando 716 - Acionar Alerta Sonoro (Buzzer)</span>
            </h4>
            <p className='text-base text-gray-700'>
                Ativa o buzzer interno do dispositivo para emitir um alerta sonoro. É útil para testar o buzzer ou para notificar o motorista sobre um comando recebido.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    716|{'{VEZES}'}|
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
                    </div>
                <p className="font-semibold text-gray-800">Comando</p>
                <div className='flex items-center space-x-2'>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                    </pre>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// COMPONENTE 13: DETALHE DO COMANDO RS232 718 (IDENTIFICAÇÃO DE PASSAGEIROS)
// ----------------------------------------------------------------------

const Command718Details = () => {
    // Comando 718: Identificação de Passageiros
    const [mode, setMode] = useState('1');
    const [commandSyntax, setCommandSyntax] = useState('718|1|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-2]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`718|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 718 - Identificação de Passageiros</span>
            </h4>
            <p className='text-base text-gray-700'>
                Ativa ou desativa a funcionalidade de identificação de passageiros.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    718|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Desativa a identificação de passageiros.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Ativa a identificação de passageiros com a ignição **ligada**.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>2:</span> Ativa a identificação de passageiros com a ignição **ligada ou desligada**.</p>
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
                        <option value="0">0: Desativado</option>
                        <option value="1">1: Ativo (Ignição Ligada)</option>
                        <option value="2">2: Ativo (Ignição Ligada ou Desligada)</option>
                    </select>
                    </div>
<p className="font-semibold text-gray-800">Comando</p>
<div className='flex items-center space-x-2'>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '1' }
                        {mode === '2' }
                        {mode === '0' }
                    </pre>
                </div>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// NOVO COMPONENTE: DETALHE DO COMANDO RS232 719 (IDENTIFICAÇÃO DE MOTORISTA)
// ----------------------------------------------------------------------

const Command719Details = () => {
    // Comando 719: Habilita ou desabilita a função de identificação de motorista.
    const [mode, setMode] = useState('1');
    const [commandSyntax, setCommandSyntax] = useState('719|1|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`719|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-400 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <UserCheck className='w-5 h-5' />
                <span>Comando 719 - Identificação de Motorista</span>
            </h4>
            <p className='text-base text-gray-700'>
                Habilita ou desabilita a função de identificação obrigatória de motorista.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    719|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Desativa a identificação de motorista.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Ativa a identificação de motorista.</p>
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
                        <option value="0">0: Desativa</option>
                        <option value="1">1: Ativa</option>
                    </select>
                    </div>
<p className="font-semibold text-gray-800">Comando</p>
<div className='flex items-center space-x-2'>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '1'}
                        {mode === '0'}
                    </pre>
                </div>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// NOVO COMPONENTE: DETALHE DO COMANDO RS232 721 (MODO MOTOCICLETA)
// ----------------------------------------------------------------------

const Command721Details = () => {
    // Comando 721: Ativa um modo específico para motocicletas.
    const [mode, setMode] = useState('1');
    const [commandSyntax, setCommandSyntax] = useState('721|1|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`721|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-300 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Bike className='w-5 h-5' /> {/* Ícone 'Bike' usado como substituto */}
                <span>Comando 721 - Modo Motocicleta</span>
            </h4>
            <p className='text-base text-gray-700'>
                Ativa um modo específico para motocicletas, onde o fio positivo e o de ignição são ligados juntos na ignição do veículo.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    721|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Desativa o modo motocicleta.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Ativa o modo motocicleta.</p>
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
                        <option value="0">0: Desativa</option>
                        <option value="1">1: Ativa</option>
                    </select>
                    </div>
<p className="font-semibold text-gray-800">Comando</p>
<div className='flex items-center space-x-2'>
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

// ----------------------------------------------------------------------
// NOVO COMPONENTE: DETALHE DO COMANDO RS232 723 (REPLICAÇÃO DA RS232)
// ----------------------------------------------------------------------

const Command723Details = () => {
    // Comando 723: Permite ligar dois aparelhos juntos ao módulo, replicando a comunicação serial.
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('723|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`723|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-400 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Repeat className='w-5 h-5' />
                <span>Comando 723 - Replicação da RS232</span>
            </h4>
            <p className='text-base text-gray-700'>
                Permite ligar dois aparelhos juntos ao módulo, replicando a comunicação serial.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    723|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Desligado (Padrão).</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Ligado.</p>
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
                        <option value="0">0: Desligado</option>
                        <option value="1">1: Ligado</option>
                    </select>
                    </div>
<p className="font-semibold text-gray-800">Comando</p>
<div className='flex items-center space-x-2'>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {mode === '1'}
                        {mode === '0'}
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command727Details = () => {
    const [mode, setMode] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('727|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1-2]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`727|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-400 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Repeat className='w-5 h-5' />
                <span>Comando 727 - Configurar Baudrate</span>
            </h4>
            <p className='text-base text-gray-700'>
                Ajusta a velocidade da comunicação serial (taxa de transmissão) para se adequar ao dispositivo rastreador conectado.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    727|{'{MODO}'}|
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
                    </div>
<p className="font-semibold text-gray-800">Comando</p>
<div className='flex items-center space-x-2'>
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

const Command728Details = () => {
    
    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('728|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = cleanVal;

        // Regra de máximo de 45000 segundos
        if (parseInt(cleanVal, 10) > MAX_SECONDS_VALUE) {
            finalVal = MAX_SECONDS_VALUE.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '0';
        }
        
        setCommandSyntax(`728|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 728 - Delay de Ignição Ligada</span>
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
                        <span className='font-semibold text-red-600'>(Valor Máximo: {MAX_SECONDS_VALUE} segundos)</span>.
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
                        placeholder={`Tempo em segundos (Máx. ${MAX_SECONDS_VALUE})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_SECONDS_VALUE} 
                    />
                    </div>
                <p className="font-semibold text-gray-800">Comando</p>
                <div className='flex items-center space-x-2'>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command729Details = () => {
    
    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('729|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = cleanVal;

        // Regra de máximo de 45000 segundos
        if (parseInt(cleanVal, 10) > MAX_SECONDS_VALUE) {
            finalVal = MAX_SECONDS_VALUE.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '0';
        }
        
        setCommandSyntax(`729|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 729 - Delay de Ignição Desligada</span>
            </h4>
            <p className='text-base text-gray-700'>
                Define um atraso, em segundos, para que o sistema considere a ignição como "desligada". O valor padrão é 3 segundos.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    729|{'{SEGUNDOS}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>SEGUNDOS:</span> Tempo de atraso em segundos. 
                        <span className='font-semibold text-red-600'>(Valor Máximo: {MAX_SECONDS_VALUE} segundos)</span>.
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
                        placeholder={`Tempo em segundos (Máx. ${MAX_SECONDS_VALUE})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_SECONDS_VALUE} 
                    />
                     </div>
                <p className="font-semibold text-gray-800">Comando</p>
                <div className='flex items-center space-x-2'>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command730Details = () => {
    const [mode, setMode] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('730|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`730|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-400 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <LogOut className='w-5 h-5' />
                <span>Comando 730 – Pacote de Logout</span>
            </h4>
            <p className='text-base text-gray-700'>
                Habilita ou desabilita o envio do pacote de dados de logout (fim de jornada).
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    730|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Pacote de logout ativo (Padrão).</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Pacote de logout desativado.</p>
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
                        <option value="0">0: Pacote de logout ativo (Padrão).</option>
                        <option value="1">1: Pacote de logout desativado.</option>
                    </select>
                    </div>
<p className="font-semibold text-gray-800">Comando</p>
<div className='flex items-center space-x-2'>
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

const Command731Details = () => {
    const [mode, setMode] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('731|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`731|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-400 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Repeat className='w-5 h-5' />
                <span>Comando 731 – Atraso no Bloqueio</span>
            </h4>
            <p className='text-base text-gray-700'>
                Configura se o bloqueio por não identificação deve ser imediato ou após um tempo.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    731|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Bloqueio imediato com a ignição ligada (Padrão).</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Bloqueia apenas após 15 segundos em caso de não identificação.</p>
                    </div>
                    
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg truncate min-w-0"
                    >
                        <option value="0">0: Bloqueio imediato com a ignição ligada (Padrão).</option>
                        <option value="1">1: Bloqueia apenas após 15 segundos em caso de não identificação.</option>
                    </select>
                    </div>
<p className="font-semibold text-gray-800">Comando</p>
<div className='flex items-center space-x-2'>
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

const Command733Details = () => {
    const MAX_BEEPS = 3;
    const [beeps, setBeeps] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('733|1|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = parseInt(cleanVal, 10);

        if (finalVal < 1 || cleanVal.length === 0) {
            finalVal = 1;
        } else if (finalVal > MAX_BEEPS) {
            finalVal = MAX_BEEPS;
        }
        
        setCommandSyntax(`733|${finalVal}|`);
        setBeeps(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Package className='w-5 h-5' />
                <span>Comando 733 – Repetição de Pacotes</span>
            </h4>
            <p className='text-base text-gray-700'>
                Define o número de vezes que os pacotes de login e logout são enviados.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    733|{'{VEZES}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>VEZES:</span> Número de vezes que os pacotes são enviados (valor mínimo 1 e máximo 3).
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
                        placeholder={`Envia o pacote (1 a ${MAX_BEEPS})`}
                        className="p-2 text-sm font-mono flex-grow"
                        min={1} 
                        max={MAX_BEEPS} 
                    />
                     </div>
                <p className="font-semibold text-gray-800">Comando</p>
                <div className='flex items-center space-x-2'>
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command734Details = () => {
    const [mode, setMode] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('734|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1-2-3]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`734|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-400 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Nfc  className='w-5 h-5' />
                <span>Comando 734 – Frequência do RFID</span>
            </h4>
            <p className='text-base text-gray-700'>
                Configura qual tecnologia de leitura RFID o módulo irá utilizar.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    734|{'{MODO}'}|
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
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>3:</span> Apenas 13.56Mhz NFC.</p>
                    </div>
                    
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg truncate min-w-0"
                    >
                        <option value="0">0: Dupla Frequência, 125Khz e 13.56Mhz (Padrão).</option>
                        <option value="1">1: Apenas 125Khz</option>
                        <option value="2">2: Apenas 13.56Mhz Mifare.</option>
                        <option value="3">3: Apenas 13.56Mhz NFC.</option>
                    </select>
                    </div>
<p className="font-semibold text-gray-800">Comando</p>
<div className='flex items-center space-x-2'>
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

const Command736Details = () => {
    const [mode, setMode] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('736|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1-2]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1, 2, 3);
        
        setCommandSyntax(`736|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-400 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <BellRing className='w-5 h-5' />
                <span>Comando 736 – Configurar Comportamento do Buzzer</span>
            </h4>
            <p className='text-base text-gray-700'>
                Permite definir quando o buzzer deve ou não ser ativado.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    736|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Buzzer ativo em todas as funções (Padrão).</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Buzzer ativo apenas para alertas (não bipa solicitando identificação).</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>2:</span> Buzzer completamente desligado.</p>
                    </div>
                    
                    
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <div className='flex items-center space-x-2'>
                    <select
                        value={mode}
                        onChange={(e) => updateCommand(e.target.value)}
                        className="p-2 text-sm font-mono flex-grow border rounded-lg truncate min-w-0"
                    >
                        <option value="0">0: Buzzer ativo em todas as funções (Padrão).</option>
                        <option value="1">1: Buzzer ativo apenas para alertas (não bipa solicitando identificação).</option>
                        <option value="2">2: Buzzer completamente desligado.</option>
                    </select>
                    </div>
<p className="font-semibold text-gray-800">Comando</p>
<div className='flex items-center space-x-2'>
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

const Command738Details = () => {
    const [mode, setMode] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('738|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1, 2);
        
        setCommandSyntax(`738|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-400 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key  className='w-5 h-5' />
                <span>Comando 738 – Alerta de Passageiro Não Cadastrado</span>
            </h4>
            <p className='text-base text-gray-700'>
                Ativa ou desativa o alerta para quando um passageiro não cadastrado tenta se identificar.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    738|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span>Alerta desativado.</p>
                    </div> 
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Alerta ativo.</p>
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
                        <option value="0">0: Alerta desativado.</option>
                        <option value="1">1: Alerta ativo.</option>
                    </select>
                    </div>
<p className="font-semibold text-gray-800">Comando</p>
<div className='flex items-center space-x-2'>
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

  // Lista de comandos disponíveis para seleção (ATUALIZADA E VERIFICADA)
  const COMMAND_OPTIONS = [
    { id: '701', name: 'Comando 701 - Cadastro de Motorista (1 ID)', Component: Command701Details },
    { id: '702', name: 'Comando 702 - Remoção de Motorista', Component: Command702Details },
    { id: '703', name: 'Comando 703 - Configurar Saída de Bloqueio', Component: Command703Details },
    { id: '704', name: 'Comando 704 - Consultar Quantidade de Cartões', Component: Command704Details },
    { id: '706', name: 'Comando 706 - Ação ao Desligar o Veículo', Component: Command706Details },
    { id: '707', name: 'Comando 707 - Apagar Todos os Cartões', Component: Command707Details },
    { id: '708', name: 'Comando 708 - Consultar Cartão Específico', Component: Command708Details },
    { id: '709', name: 'Comando 709 - Configurar Timeout de Identificação', Component: Command709Details },
    { id: '710', name: `Comando 710 - Adicionar Cartões em Lote (Máx. ${MAX_CARDS_710})`, Component: Command710Details }, 
    { id: '711', name: 'Comando 711 - Alterar Protocolo de Comunicação', Component: Command711Details },
    { id: '712', name: 'Comando 712 - Reset de Fábrica', Component: Command712Details },
    { id: '716', name: 'Comando 716 - Acionar Alerta Sonoro (Buzzer)', Component: Command716Details }, 
    { id: '718', name: 'Comando 718 - Identificação de Passageiros', Component: Command718Details }, 
    { id: '719', name: 'Comando 719 - Identificação de Motorista', Component: Command719Details }, 
    { id: '721', name: 'Comando 721 - Modo Motocicleta', Component: Command721Details }, 
    { id: '723', name: 'Comando 723 - Replicação da RS232', Component: Command723Details },
    { id: '727', name: 'Comando 727 - Configurar Baudrate', Component: Command727Details },
    { id: '728', name: 'Comando 728 - Delay de Ignição Ligada', Component: Command728Details },
    { id: '729', name: 'Comando 729 – Delay de Ignição Desligada', Component: Command729Details },
    { id: '730', name: 'Comando 730 – Pacote de Logout', Component: Command730Details },
    { id: '731', name: 'Comando 731 – Atraso no Bloqueio', Component: Command731Details },
    { id: '733', name: 'Comando  733 – Repetição de Pacotes', Component: Command733Details },
    { id: '734', name: 'Comando  734 – Frequência do RFID', Component: Command734Details },
    { id: '736', name: 'Comando  736 – Configurar Comportamento do Buzzer', Component: Command736Details },
    { id: '738', name: 'Comando  738 – Alerta de Passageiro Não Cadastrado', Component: Command738Details },
    
  ];
  const [selectedCommand, setSelectedCommand] = useState(COMMAND_OPTIONS[0]); // Começa no 701

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
      <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-1 z-70">
        <div className="container mx-auto px-6 sm:px-6 ">
          <div className="flex items-center justify-between h-30">
            <div className="flex items-center space-x-2">
              <div>
                {/* Mantenho a imagem do logo conforme o original */}
                <img 
                  src={Logo}
                  alt="Getscale Logo" 
                  className="h-18 object-contain"
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
              Comandos RS232 para Gs-404, Gs-100 e Gs-501
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
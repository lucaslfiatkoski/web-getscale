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


// ----------------------------------------------------------------------
// CONSTANTES DE COMANDO
// ----------------------------------------------------------------------
const whatsappNumber = '5541991676700'; // Formato internacional sem caracteres especiais
const whatsappMessage = 'Olá, Getscale! Gostaria de falar com o suporte técnico sobre produtos e ligações.';
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

// Limite de 0xFFFFFFFF (8 dígitos hexadecimais)
const MAX_HEX_DIGITS = 8;
const MAX_VALUE_DESCRIPTION = '0xFFFFFFFF';
// Limite de segundos para o comando 709 (Regra anterior)
const MAX_SECONDS_VALUE = 25000; 
const MIN_SECONDS_VALUE = 15;
// Limite de cartões para o comando 710
const MAX_CARDS_710 = 10;
const MAX_TEMP_VALUE = 130;
const MIN_TEMP_VALUE = -50;


// ----------------------------------------------------------------------
// COMPONENTE 1: DETALHE DO COMANDO RS232 701 (CADASTRO DE CARTÃO)
// ----------------------------------------------------------------------



const Command401Details = () => {
    // Comando 709: Configurar Timeout de Identificação
    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('401|15|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = cleanVal;

        // Regra de máximo de 45000 segundos
        if (parseInt(cleanVal, 10) > MAX_SECONDS_VALUE) {
            finalVal = MAX_SECONDS_VALUE.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '15';
        }

        if (parseInt(MIN_SECONDS_VALUE) > parseInt(cleanVal, 10) && cleanVal.length !== 0) {
            finalVal = MIN_SECONDS_VALUE.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '15';
        }
        
        setCommandSyntax(`401|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 401 - Tempo de envio Ignição ligada</span>
            </h4>
            <p className='text-base text-gray-700'>
                Intervalo de envio da informação com a ignição 
                ligada em segundos.  
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    401|{'{SEGUNDOS}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>SEGUNDOS:</span> 
                        <span className='font-semibold text-red-600'> ( Valor mínimo : {MIN_SECONDS_VALUE} segundos, Valor Máximo: {MAX_SECONDS_VALUE} segundos)</span>.
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
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0
                            ? `// Define o tempo de envio para ${commandSyntax.split('|')[1]} segundos`
                            : `// Define o tempo de envio para ${commandSyntax.split('|')[1]} segundos`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};


const Command402Details = () => {
    // Comando 709: Configurar Timeout de Identificação
    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('402|15|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = cleanVal;

        // Regra de máximo de 45000 segundos
        if (parseInt(cleanVal, 10) > MAX_SECONDS_VALUE) {
            finalVal = MAX_SECONDS_VALUE.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '15';
        }

        if (parseInt(MIN_SECONDS_VALUE) > parseInt(cleanVal, 10) && cleanVal.length !== 0) {
            finalVal = MIN_SECONDS_VALUE.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '15';
        }
        
        setCommandSyntax(`402|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 402 - Tempo de envio Ignição desligada</span>
            </h4>
            <p className='text-base text-gray-700'>
                Intervalo de envio da informação com a ignição 
                desligada em segundos.  
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    402|{'{SEGUNDOS}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>SEGUNDOS:</span> 
                        <span className='font-semibold text-red-600'> ( Valor mínimo : {MIN_SECONDS_VALUE} segundos, Valor Máximo: {MAX_SECONDS_VALUE} segundos)</span>.
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
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0
                            ? `// Define o tempo de envio para ${commandSyntax.split('|')[1]} segundos`
                            : `// Define o tempo de envio para ${commandSyntax.split('|')[1]} segundos`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command403Details = () => {
    // Comando 709: Configurar Timeout de Identificação
    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('403|15|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-9]/g, '');
        let finalVal = cleanVal;

        // Regra de máximo de 45000 segundos
        if (parseInt(cleanVal, 10) > MAX_SECONDS_VALUE) {
            finalVal = MAX_SECONDS_VALUE.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '15';
        }

        if (parseInt(MIN_SECONDS_VALUE) > parseInt(cleanVal, 10) && cleanVal.length !== 0) {
            finalVal = MIN_SECONDS_VALUE.toString();
        } else if (cleanVal.length === 0) {
            finalVal = '15';
        }
        
        setCommandSyntax(`403|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 403 - Tempo de envio Em alerta </span>
            </h4>
            <p className='text-base text-gray-700'>
                Intervalo de envio da informação em alerta em 
                segundos. 
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    403|{'{SEGUNDOS}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>SEGUNDOS:</span> 
                        <span className='font-semibold text-red-600'> ( Valor mínimo : {MIN_SECONDS_VALUE} segundos, Valor Máximo: {MAX_SECONDS_VALUE} segundos)</span>.
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
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Define o tempo de envio para ${commandSyntax.split('|')[1]} segundos`
                            : `// Define o tempo de envio para ${commandSyntax.split('|')[1]} segundos`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command404Details = () => {

    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('');

    const updateCommand = useCallback((val) => {
        
        // 1. Alteração: Permite dígitos (0-9) e o sinal de menos (-) no início ou após outros caracteres
        const cleanedVal = val.replace(/[^0-9-]/g, ''); // Permite o '-'
        let finalVal = cleanedVal;

        // Limpa múltiplos sinais de '-' e garante que o '-' esteja apenas no início
        const sign = cleanedVal.startsWith('-') ? '-' : '';
        const numberPart = cleanedVal.replace(/-/g, '');
        const cleanVal = sign + numberPart;
        
        // Se o valor limpo for apenas '-', defina como vazio para não tentar fazer o parseInt
        if (cleanVal === '-') {
            setCommandSyntax(`404||`); // Ou outro valor padrão que você queira para o estado 'apenas -'
            setSeconds(cleanVal);
            return; 
        }

        const numericVal = parseInt(cleanVal, 10);
        
        // Se o campo estiver vazio ou for NaN após a limpeza (ex: apenas '-')
        if (cleanVal.length === 0 || isNaN(numericVal)) {
            finalVal = '130';
        } else if (numericVal > MAX_TEMP_VALUE) {
            finalVal = MAX_TEMP_VALUE.toString();
        } else if (numericVal < MIN_TEMP_VALUE) {
             finalVal = MIN_TEMP_VALUE.toString();
        } else {
             finalVal = cleanVal;
        }
       
        if (cleanVal.length === 0) {
            finalVal = '-50'; // Padrão baseado no seu último 'else if' para campo vazio
        }

        setCommandSyntax(`404|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);


    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 404 - Correção sensor 1   </span>
            </h4>
            <p className='text-base text-gray-700'>
               Correção do valor informado do sensor 1 em 
                graus celsius.  
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    404|{'{Temperatura}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>Temperatura:</span> 
                        <span className='font-semibold text-red-600'> ( Valor mínimo : {MIN_TEMP_VALUE} graus celsius, Valor Máximo: {MAX_TEMP_VALUE} graus celsius)</span>.
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
                        placeholder={`Temperatura (Máx. ${MAX_TEMP_VALUE} , Min. ${MIN_TEMP_VALUE})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_TEMP_VALUE} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Configura a correção do sensor 1 em ${commandSyntax.split('|')[1]} graus celsius.`
                            : `// Configura a correção do sensor 1 em ${commandSyntax.split('|')[1]} graus celsius.`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command405Details = () => {

    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('');

    const updateCommand = useCallback((val) => {
        
        // 1. Alteração: Permite dígitos (0-9) e o sinal de menos (-) no início ou após outros caracteres
        const cleanedVal = val.replace(/[^0-9-]/g, ''); // Permite o '-'
        let finalVal = cleanedVal;

        // Limpa múltiplos sinais de '-' e garante que o '-' esteja apenas no início
        const sign = cleanedVal.startsWith('-') ? '-' : '';
        const numberPart = cleanedVal.replace(/-/g, '');
        const cleanVal = sign + numberPart;
        
        // Se o valor limpo for apenas '-', defina como vazio para não tentar fazer o parseInt
        if (cleanVal === '-') {
            setCommandSyntax(`405||`); // Ou outro valor padrão que você queira para o estado 'apenas -'
            setSeconds(cleanVal);
            return; 
        }

        const numericVal = parseInt(cleanVal, 10);
        
        // Se o campo estiver vazio ou for NaN após a limpeza (ex: apenas '-')
        if (cleanVal.length === 0 || isNaN(numericVal)) {
            finalVal = '130';
        } else if (numericVal > MAX_TEMP_VALUE) {
            finalVal = MAX_TEMP_VALUE.toString();
        } else if (numericVal < MIN_TEMP_VALUE) {
             finalVal = MIN_TEMP_VALUE.toString();
        } else {
             finalVal = cleanVal;
        }
       
        if (cleanVal.length === 0) {
            finalVal = '-50'; // Padrão baseado no seu último 'else if' para campo vazio
        }

        setCommandSyntax(`405|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);


    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 405 - Correção sensor 2   </span>
            </h4>
            <p className='text-base text-gray-700'>
               Correção do valor informado do sensor 2 em 
                graus celsius.  
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    405|{'{Temperatura}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>Temperatura:</span> 
                        <span className='font-semibold text-red-600'> ( Valor mínimo : {MIN_TEMP_VALUE} graus celsius, Valor Máximo: {MAX_TEMP_VALUE} graus celsius)</span>.
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
                        placeholder={`Temperatura (Máx. ${MAX_TEMP_VALUE} , Min. ${MIN_TEMP_VALUE})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_TEMP_VALUE} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Configura a correção do sensor 2 em ${commandSyntax.split('|')[1]} graus celsius.`
                            : `// Configura a correção do sensor 2 em ${commandSyntax.split('|')[1]} graus celsius.`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command406Details = () => {

    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('');

    const updateCommand = useCallback((val) => {
        
        // 1. Alteração: Permite dígitos (0-9) e o sinal de menos (-) no início ou após outros caracteres
        const cleanedVal = val.replace(/[^0-9-]/g, ''); // Permite o '-'
        let finalVal = cleanedVal;

        // Limpa múltiplos sinais de '-' e garante que o '-' esteja apenas no início
        const sign = cleanedVal.startsWith('-') ? '-' : '';
        const numberPart = cleanedVal.replace(/-/g, '');
        const cleanVal = sign + numberPart;
        
        // Se o valor limpo for apenas '-', defina como vazio para não tentar fazer o parseInt
        if (cleanVal === '-') {
            setCommandSyntax(`406||`); // Ou outro valor padrão que você queira para o estado 'apenas -'
            setSeconds(cleanVal);
            return; 
        }

        const numericVal = parseInt(cleanVal, 10);
        
        // Se o campo estiver vazio ou for NaN após a limpeza (ex: apenas '-')
        if (cleanVal.length === 0 || isNaN(numericVal)) {
            finalVal = '130';
        } else if (numericVal > MAX_TEMP_VALUE) {
            finalVal = MAX_TEMP_VALUE.toString();
        } else if (numericVal < MIN_TEMP_VALUE) {
             finalVal = MIN_TEMP_VALUE.toString();
        } else {
             finalVal = cleanVal;
        }
       
        if (cleanVal.length === 0) {
            finalVal = '-50'; // Padrão baseado no seu último 'else if' para campo vazio
        }

        setCommandSyntax(`406|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);


    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 406 - Correção sensor 3 </span>
            </h4>
            <p className='text-base text-gray-700'>
               Correção do valor informado do sensor 3 em 
                graus celsius.  
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    406|{'{Temperatura}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>Temperatura:</span> 
                        <span className='font-semibold text-red-600'> ( Valor mínimo : {MIN_TEMP_VALUE} graus celsius, Valor Máximo: {MAX_TEMP_VALUE} graus celsius)</span>.
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
                        placeholder={`Temperatura (Máx. ${MAX_TEMP_VALUE} , Min. ${MIN_TEMP_VALUE})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_TEMP_VALUE} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Configura a correção do sensor 3 em ${commandSyntax.split('|')[1]} graus celsius.`
                            : `// Configura a correção do sensor 3 em ${commandSyntax.split('|')[1]} graus celsius.`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command407Details = () => {

    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('');

    const updateCommand = useCallback((val) => {
        
        // 1. Alteração: Permite dígitos (0-9) e o sinal de menos (-) no início ou após outros caracteres
        const cleanedVal = val.replace(/[^0-9-]/g, ''); // Permite o '-'
        let finalVal = cleanedVal;

        // Limpa múltiplos sinais de '-' e garante que o '-' esteja apenas no início
        const sign = cleanedVal.startsWith('-') ? '-' : '';
        const numberPart = cleanedVal.replace(/-/g, '');
        const cleanVal = sign + numberPart;
        
        // Se o valor limpo for apenas '-', defina como vazio para não tentar fazer o parseInt
        if (cleanVal === '-') {
            setCommandSyntax(`407||`); // Ou outro valor padrão que você queira para o estado 'apenas -'
            setSeconds(cleanVal);
            return; 
        }

        const numericVal = parseInt(cleanVal, 10);
        
        // Se o campo estiver vazio ou for NaN após a limpeza (ex: apenas '-')
        if (cleanVal.length === 0 || isNaN(numericVal)) {
            finalVal = '130';
        } else if (numericVal > MAX_TEMP_VALUE) {
            finalVal = MAX_TEMP_VALUE.toString();
        } else if (numericVal < MIN_TEMP_VALUE) {
             finalVal = MIN_TEMP_VALUE.toString();
        } else {
             finalVal = cleanVal;
        }
       
        if (cleanVal.length === 0) {
            finalVal = '-50'; // Padrão baseado no seu último 'else if' para campo vazio
        }

        setCommandSyntax(`407|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);


    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 407 - Temperatura maxima no sensor 1  </span>
            </h4>
            <p className='text-base text-gray-700'>
               Configura o maximo valor da temperatura no sensor 1.  
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    407|{'{Temperatura}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>Temperatura:</span> 
                        <span className='font-semibold text-red-600'> ( Valor mínimo : {MIN_TEMP_VALUE} graus celsius, Valor Máximo: {MAX_TEMP_VALUE} graus celsius)</span>.
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
                        placeholder={`Temperatura (Máx. ${MAX_TEMP_VALUE} , Min. ${MIN_TEMP_VALUE})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_TEMP_VALUE} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Seta o valor maximo do alerta no sensor 1 em ${commandSyntax.split('|')[1]} graus celsius.`
                            : `// Seta o valor maximo do alerta no sensor 1 em ${commandSyntax.split('|')[1]} graus celsius.`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command408Details = () => {

    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('');

    const updateCommand = useCallback((val) => {
        
        // 1. Alteração: Permite dígitos (0-9) e o sinal de menos (-) no início ou após outros caracteres
        const cleanedVal = val.replace(/[^0-9-]/g, ''); // Permite o '-'
        let finalVal = cleanedVal;

        // Limpa múltiplos sinais de '-' e garante que o '-' esteja apenas no início
        const sign = cleanedVal.startsWith('-') ? '-' : '';
        const numberPart = cleanedVal.replace(/-/g, '');
        const cleanVal = sign + numberPart;
        
        // Se o valor limpo for apenas '-', defina como vazio para não tentar fazer o parseInt
        if (cleanVal === '-') {
            setCommandSyntax(`408||`); // Ou outro valor padrão que você queira para o estado 'apenas -'
            setSeconds(cleanVal);
            return; 
        }

        const numericVal = parseInt(cleanVal, 10);
        
        // Se o campo estiver vazio ou for NaN após a limpeza (ex: apenas '-')
        if (cleanVal.length === 0 || isNaN(numericVal)) {
            finalVal = '130';
        } else if (numericVal > MAX_TEMP_VALUE) {
            finalVal = MAX_TEMP_VALUE.toString();
        } else if (numericVal < MIN_TEMP_VALUE) {
             finalVal = MIN_TEMP_VALUE.toString();
        } else {
             finalVal = cleanVal;
        }
       
        if (cleanVal.length === 0) {
            finalVal = '-50'; // Padrão baseado no seu último 'else if' para campo vazio
        }

        setCommandSyntax(`408|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);


    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 408 - Temperatura maxima no sensor 2  </span>
            </h4>
            <p className='text-base text-gray-700'>
               Configura o maximo valor da temperatura no sensor 2.  
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    408|{'{Temperatura}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>Temperatura:</span> 
                        <span className='font-semibold text-red-600'> ( Valor mínimo : {MIN_TEMP_VALUE} graus celsius, Valor Máximo: {MAX_TEMP_VALUE} graus celsius)</span>.
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
                        placeholder={`Temperatura (Máx. ${MAX_TEMP_VALUE} , Min. ${MIN_TEMP_VALUE})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_TEMP_VALUE} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Seta o valor maximo do alerta no sensor 2 em ${commandSyntax.split('|')[1]} graus celsius.`
                            : `// Seta o valor maximo do alerta no sensor 2 em ${commandSyntax.split('|')[1]} graus celsius.`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command409Details = () => {

    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('');

    const updateCommand = useCallback((val) => {
        
        // 1. Alteração: Permite dígitos (0-9) e o sinal de menos (-) no início ou após outros caracteres
        const cleanedVal = val.replace(/[^0-9-]/g, ''); // Permite o '-'
        let finalVal = cleanedVal;

        // Limpa múltiplos sinais de '-' e garante que o '-' esteja apenas no início
        const sign = cleanedVal.startsWith('-') ? '-' : '';
        const numberPart = cleanedVal.replace(/-/g, '');
        const cleanVal = sign + numberPart;
        
        // Se o valor limpo for apenas '-', defina como vazio para não tentar fazer o parseInt
        if (cleanVal === '-') {
            setCommandSyntax(`409||`); // Ou outro valor padrão que você queira para o estado 'apenas -'
            setSeconds(cleanVal);
            return; 
        }

        const numericVal = parseInt(cleanVal, 10);
        
        // Se o campo estiver vazio ou for NaN após a limpeza (ex: apenas '-')
        if (cleanVal.length === 0 || isNaN(numericVal)) {
            finalVal = '130';
        } else if (numericVal > MAX_TEMP_VALUE) {
            finalVal = MAX_TEMP_VALUE.toString();
        } else if (numericVal < MIN_TEMP_VALUE) {
             finalVal = MIN_TEMP_VALUE.toString();
        } else {
             finalVal = cleanVal;
        }
       
        if (cleanVal.length === 0) {
            finalVal = '-50'; // Padrão baseado no seu último 'else if' para campo vazio
        }

        setCommandSyntax(`409|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);


    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 409 - Temperatura maxima no sensor 3  </span>
            </h4>
            <p className='text-base text-gray-700'>
               Configura o maximo valor da temperatura no sensor 3.  
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    409|{'{Temperatura}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>Temperatura:</span> 
                        <span className='font-semibold text-red-600'> ( Valor mínimo : {MIN_TEMP_VALUE} graus celsius, Valor Máximo: {MAX_TEMP_VALUE} graus celsius)</span>.
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
                        placeholder={`Temperatura (Máx. ${MAX_TEMP_VALUE} , Min. ${MIN_TEMP_VALUE})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_TEMP_VALUE} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Seta o valor maximo do alerta no sensor 3 em ${commandSyntax.split('|')[1]} graus celsius.`
                            : `// Seta o valor maximo do alerta no sensor 3 em ${commandSyntax.split('|')[1]} graus celsius.`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command410Details = () => {

    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('');

    const updateCommand = useCallback((val) => {
        
        // 1. Alteração: Permite dígitos (0-9) e o sinal de menos (-) no início ou após outros caracteres
        const cleanedVal = val.replace(/[^0-9-]/g, ''); // Permite o '-'
        let finalVal = cleanedVal;

        // Limpa múltiplos sinais de '-' e garante que o '-' esteja apenas no início
        const sign = cleanedVal.startsWith('-') ? '-' : '';
        const numberPart = cleanedVal.replace(/-/g, '');
        const cleanVal = sign + numberPart;
        
        // Se o valor limpo for apenas '-', defina como vazio para não tentar fazer o parseInt
        if (cleanVal === '-') {
            setCommandSyntax(`410||`); // Ou outro valor padrão que você queira para o estado 'apenas -'
            setSeconds(cleanVal);
            return; 
        }

        const numericVal = parseInt(cleanVal, 10);
        
        // Se o campo estiver vazio ou for NaN após a limpeza (ex: apenas '-')
        if (cleanVal.length === 0 || isNaN(numericVal)) {
            finalVal = '130';
        } else if (numericVal > MAX_TEMP_VALUE) {
            finalVal = MAX_TEMP_VALUE.toString();
        } else if (numericVal < MIN_TEMP_VALUE) {
             finalVal = MIN_TEMP_VALUE.toString();
        } else {
             finalVal = cleanVal;
        }
       
        if (cleanVal.length === 0) {
            finalVal = '-50'; // Padrão baseado no seu último 'else if' para campo vazio
        }

        setCommandSyntax(`410|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);


    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 410 - Temperatura mínima no sensor 1  </span>
            </h4>
            <p className='text-base text-gray-700'>
               Configura o mínimo valor da temperatura no sensor 1.  
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    410|{'{Temperatura}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>Temperatura:</span> 
                        <span className='font-semibold text-red-600'> ( Valor mínimo : {MIN_TEMP_VALUE} graus celsius, Valor Máximo: {MAX_TEMP_VALUE} graus celsius)</span>.
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
                        placeholder={`Temperatura (Máx. ${MAX_TEMP_VALUE} , Min. ${MIN_TEMP_VALUE})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_TEMP_VALUE} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Seta o valor minimo do alerta no sensor 1 em ${commandSyntax.split('|')[1]} graus celsius.`
                            : `// Seta o valor minimo do alerta no sensor 1 em ${commandSyntax.split('|')[1]} graus celsius.`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command411Details = () => {

    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('');

    const updateCommand = useCallback((val) => {
        
        // 1. Alteração: Permite dígitos (0-9) e o sinal de menos (-) no início ou após outros caracteres
        const cleanedVal = val.replace(/[^0-9-]/g, ''); // Permite o '-'
        let finalVal = cleanedVal;

        // Limpa múltiplos sinais de '-' e garante que o '-' esteja apenas no início
        const sign = cleanedVal.startsWith('-') ? '-' : '';
        const numberPart = cleanedVal.replace(/-/g, '');
        const cleanVal = sign + numberPart;
        
        // Se o valor limpo for apenas '-', defina como vazio para não tentar fazer o parseInt
        if (cleanVal === '-') {
            setCommandSyntax(`411||`); // Ou outro valor padrão que você queira para o estado 'apenas -'
            setSeconds(cleanVal);
            return; 
        }

        const numericVal = parseInt(cleanVal, 10);
        
        // Se o campo estiver vazio ou for NaN após a limpeza (ex: apenas '-')
        if (cleanVal.length === 0 || isNaN(numericVal)) {
            finalVal = '130';
        } else if (numericVal > MAX_TEMP_VALUE) {
            finalVal = MAX_TEMP_VALUE.toString();
        } else if (numericVal < MIN_TEMP_VALUE) {
             finalVal = MIN_TEMP_VALUE.toString();
        } else {
             finalVal = cleanVal;
        }
       
        if (cleanVal.length === 0) {
            finalVal = '-50'; // Padrão baseado no seu último 'else if' para campo vazio
        }

        setCommandSyntax(`411|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);


    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 411 - Temperatura mínima no sensor 2  </span>
            </h4>
            <p className='text-base text-gray-700'>
               Configura o mínimo valor da temperatura no sensor 2.  
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    411|{'{Temperatura}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>Temperatura:</span> 
                        <span className='font-semibold text-red-600'> ( Valor mínimo : {MIN_TEMP_VALUE} graus celsius, Valor Máximo: {MAX_TEMP_VALUE} graus celsius)</span>.
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
                        placeholder={`Temperatura (Máx. ${MAX_TEMP_VALUE} , Min. ${MIN_TEMP_VALUE})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_TEMP_VALUE} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Seta o valor minimo do alerta no sensor 2 em ${commandSyntax.split('|')[1]} graus celsius.`
                            : `// Seta o valor minimo do alerta no sensor 2 em ${commandSyntax.split('|')[1]} graus celsius.`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};

const Command412Details = () => {

    const [seconds, setSeconds] = useState('');
    const [commandSyntax, setCommandSyntax] = useState('');

    const updateCommand = useCallback((val) => {
        
        // 1. Alteração: Permite dígitos (0-9) e o sinal de menos (-) no início ou após outros caracteres
        const cleanedVal = val.replace(/[^0-9-]/g, ''); // Permite o '-'
        let finalVal = cleanedVal;

        // Limpa múltiplos sinais de '-' e garante que o '-' esteja apenas no início
        const sign = cleanedVal.startsWith('-') ? '-' : '';
        const numberPart = cleanedVal.replace(/-/g, '');
        const cleanVal = sign + numberPart;
        
        // Se o valor limpo for apenas '-', defina como vazio para não tentar fazer o parseInt
        if (cleanVal === '-') {
            setCommandSyntax(`412||`); // Ou outro valor padrão que você queira para o estado 'apenas -'
            setSeconds(cleanVal);
            return; 
        }

        const numericVal = parseInt(cleanVal, 10);
        
        // Se o campo estiver vazio ou for NaN após a limpeza (ex: apenas '-')
        if (cleanVal.length === 0 || isNaN(numericVal)) {
            finalVal = '130';
        } else if (numericVal > MAX_TEMP_VALUE) {
            finalVal = MAX_TEMP_VALUE.toString();
        } else if (numericVal < MIN_TEMP_VALUE) {
             finalVal = MIN_TEMP_VALUE.toString();
        } else {
             finalVal = cleanVal;
        }
       
        if (cleanVal.length === 0) {
            finalVal = '-50'; // Padrão baseado no seu último 'else if' para campo vazio
        }

        setCommandSyntax(`412|${finalVal}|`);
        setSeconds(cleanVal);
    }, []);


    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Clock className='w-5 h-5' />
                <span>Comando 412 - Temperatura mínima no sensor 3  </span>
            </h4>
            <p className='text-base text-gray-700'>
               Configura o mínimo valor da temperatura no sensor 3.  
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    412|{'{Temperatura}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='flex items-start space-x-2 text-sm text-gray-700'>
                    <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                    <p>
                        <span className='font-bold'>Temperatura:</span> 
                        <span className='font-semibold text-red-600'> ( Valor mínimo : {MIN_TEMP_VALUE} graus celsius, Valor Máximo: {MAX_TEMP_VALUE} graus celsius)</span>.
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
                        placeholder={`Temperatura (Máx. ${MAX_TEMP_VALUE} , Min. ${MIN_TEMP_VALUE})`}
                        className="p-2 text-sm font-mono flex-grow"
                        max={MAX_TEMP_VALUE} 
                    />
                    <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap flex-grow-0 min-w-[200px]"> 
                        {commandSyntax} 
                        {parseInt(seconds, 10) === 0 
                            ? `// Seta o valor minimo do alerta no sensor 3 em ${commandSyntax.split('|')[1]} graus celsius.`
                            : `// Seta o valor minimo do alerta no sensor 3 em ${commandSyntax.split('|')[1]} graus celsius.`
                        }
                    </pre>
                </div>
            </div>
        </div>
    );
};
// ----------------------------------------------------------------------
// COMPONENTE 9: DETALHE DO COMANDO RS232 710 (ADICIONAR CARTÕES EM LOTE)
// ----------------------------------------------------------------------



const Command455Details = () => {
    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Shuffle className='w-5 h-5' />
                <span>Comando 455 - Alterar Protocolo de Comunicação</span>
            </h4>
            <p className='text-base text-gray-700'>
                Permite alterar o formato da string de comunicação para garantir compatibilidade com diferentes plataformas de rastreamento.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    455|{'{PROTOCOLO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Protocolo Padrão.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>2:</span> Protocolo VDO.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>3:</span> Protocolo GV75.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>4:</span> Protocolo GV300.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>5:</span> Protocolo GV300CAN.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>6:</span> Protocolo VDO Transparente.</p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>7:</span> Protocolo GV75M.</p>
                    </div>
                </div>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Exemplo</p>
                <pre className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    755|2| // Habilita o protocolo VDO.
                </pre>
            </div>
        </div>
    );
};


const Command413Details = () => {
    // Comando 718: Identificação de Passageiros
    const [mode, setMode] = useState('0');
    const [commandSyntax, setCommandSyntax] = useState('413|0|');

    const updateCommand = useCallback((val) => {
        const cleanVal = val.replace(/[^0-1]/g, '');
        let finalVal = cleanVal.length === 0 ? '0' : cleanVal.slice(0, 1);
        
        setCommandSyntax(`413|${finalVal}|`);
        setMode(finalVal);
    }, []);

    return (
        <div className='p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4'>
            <h4 className="text-xl font-bold text-blue-800 mb-2 flex items-center space-x-2">
                <Key className='w-5 h-5' />
                <span>Comando 413 - Configura a função de leitura de CO2</span>
            </h4>
            <p className='text-base text-gray-700'>
                Ativa ou desativa a funcionalidade de leitura de CO2.
            </p>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Sintaxe</p>
                <pre className="bg-gray-100 p-3 rounded-lg border border-gray-300 text-sm font-mono whitespace-pre-wrap"> 
                    413|{'{MODO}'}|
                </pre>
            </div>
            <div className='space-y-2'>
                <p className="font-semibold text-gray-800">Parâmetros</p>
                <div className='space-y-1 text-sm text-gray-700'>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>0:</span> Leitura desabilitada por padrão. </p>
                    </div>
                    <div className='flex items-start space-x-2'>
                        <ChevronRight className='w-4 h-4 mt-1 flex-shrink-0 text-gray-600' />
                        <p><span className='font-bold'>1:</span> Desativa o sensor 3 e habilita o CO2.</p>
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
                        <option value="1">1: Ativo</option>
                    </select>
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
    { id: '401', name: 'Comando 401 - Tempo de envio Ignição ligada ', Component: Command401Details },
    { id: '402', name: `Comando 402 - Tempo de envio Ignição desligada`, Component: Command402Details }, 
    { id: '404', name: 'Comando 404 - Correção sensor 1 ', Component: Command404Details },
    { id: '405', name: 'Comando 405 - Correção sensor 2', Component: Command405Details },
    { id: '406', name: 'Comando 406 - Correção sensor 3', Component: Command406Details }, 
    { id: '407', name: 'Comando 407 - Temperatura maxima no sensor 1 ', Component: Command407Details }, 
    { id: '408', name: 'Comando 408 - Temperatura maxima no sensor 2', Component: Command408Details }, 
    { id: '409', name: 'Comando 409 - Temperatura maxima no sensor 3', Component: Command409Details }, 
    { id: '410', name: 'Comando 410 - Temperatura mínima no sensor 1', Component: Command410Details },
    { id: '411', name: 'Comando 411 - Temperatura mínima no sensor 2', Component: Command411Details },
    { id: '412', name: 'Comando 412 - Temperatura mínima no sensor 3', Component: Command412Details },
    { id: '455', name: 'Comando 455 – Configuração do Protocolo', Component: Command455Details },
    { id: '413', name: 'Comando 413 – Configura a função de leitura de CO2', Component: Command413Details },
  ];
  const [selectedCommand, setSelectedCommand] = useState(COMMAND_OPTIONS[0]); // Começa no 701

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
              Comandos RS232 para Gs-302
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
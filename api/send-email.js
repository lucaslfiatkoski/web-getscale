import { createTransport } from 'nodemailer';

// Mudamos a forma como a função é declarada e exportada
export async function sendEmailHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método não permitido.' });
    }
    
    // Desestrutura os dados enviados pelo formulário
    const { nome, email, telefone, assunto, mensagem } = req.body;

    // Carrega as variáveis do process.env (que o api-server.js já carregou)
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT, 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactReceiver = process.env.CONTACT_EMAIL_RECEIVER;
    
    // === 1. CONFIGURAÇÃO DO TRANSPORTER ===
    const transporter = createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // === 2. MONTAGEM DA MENSAGEM ===
    const mailOptions = {
        from: `"Formulário - ${nome}" <${smtpUser}>`,
        to: contactReceiver,
        replyTo: email,
        subject: `[CONTATO SITE] ${assunto || 'Nova Mensagem'}`,
        html: `
            <h2>Nova Mensagem de Contato</h2>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${telefone || 'Não informado'}</p>
            <p><strong>Mensagem:</strong></p>
            <p style="white-space: pre-wrap;">${mensagem}</p>
        `,
    };

    // === 3. ENVIO ===
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email enviado com sucesso de ${nome} <${email}>`);
        return res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return res.status(500).json({ success: false, message: 'Falha no envio do e-mail.', error: error.message });
    }
}
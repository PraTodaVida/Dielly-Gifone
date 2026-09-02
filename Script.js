/**
 * CONSÓRCIO PRIME - JAVASCRIPT PRINCIPAL
 * Configure abaixo os dados da sua empresa facilmente!
 */

const SITE_CONFIG = {
    // Digite seu número do WhatsApp com DDI (55) + DDD + Número, apenas dígitos:
    whatsappNumber: "5511999999999",
    
    // Nome da sua empresa / consultoria
    companyName: "Consórcio Prime",
    
    // Parâmetros de cada modalidade de consórcio para o simulador
    segments: {
        imovel: {
            name: "Imóvel / Construção",
            minCredit: 100000,
            maxCredit: 1500000,
            stepCredit: 10000,
            defaultCredit: 300000,
            minMonths: 120,
            maxMonths: 240,
            stepMonths: 12,
            defaultMonths: 180,
            adminFeeRate: 0.18, // 18% taxa de administração total aproximada
            reserveFundRate: 0.02, // 2% fundo de reserva
            reducedInstallmentFactor: 0.70 // Parcela reduzida a 70% até contemplação
        },
        auto: {
            name: "Automóveis & Motos",
            minCredit: 30000,
            maxCredit: 300000,
            stepCredit: 5000,
            defaultCredit: 90000,
            minMonths: 36,
            maxMonths: 100,
            stepMonths: 6,
            defaultMonths: 72,
            adminFeeRate: 0.15,
            reserveFundRate: 0.02,
            reducedInstallmentFactor: 0.75
        },
        pesados: {
            name: "Pesados & Agronegócio",
            minCredit: 150000,
            maxCredit: 1500000,
            stepCredit: 25000,
            defaultCredit: 450000,
            minMonths: 60,
            maxMonths: 120,
            stepMonths: 12,
            defaultMonths: 100,
            adminFeeRate: 0.14,
            reserveFundRate: 0.02,
            reducedInstallmentFactor: 0.75
        },
        servicos: {
            name: "Serviços & Investimentos",
            minCredit: 15000,
            maxCredit: 60000,
            stepCredit: 2500,
            defaultCredit: 30000,
            minMonths: 24,
            maxMonths: 48,
            stepMonths: 6,
            defaultMonths: 36,
            adminFeeRate: 0.16,
            reserveFundRate: 0.02,
            reducedInstallmentFactor: 0.80
        }
    }
};

// Estado atual da simulação
let currentSegment = 'imovel';

// Elementos DOM do Simulador
const creditRange = document.getElementById('creditRange');
const monthsRange = document.getElementById('monthsRange');
const creditValueDisplay = document.getElementById('creditValueDisplay');
const monthsValueDisplay = document.getElementById('monthsValueDisplay');
const minCreditLabel = document.getElementById('minCreditLabel');
const maxCreditLabel = document.getElementById('maxCreditLabel');
const minMonthsLabel = document.getElementById('minMonthsLabel');
const maxMonthsLabel = document.getElementById('maxMonthsLabel');
const reducedInstallmentToggle = document.getElementById('reducedInstallmentToggle');
const estimatedInstallmentDisplay = document.getElementById('estimatedInstallmentDisplay');
const installmentTypeBadge = document.getElementById('installmentTypeBadge');
const summarySegment = document.getElementById('summarySegment');
const summaryCredit = document.getElementById('summaryCredit');
const summaryMonths = document.getElementById('summaryMonths');
const sendSimulationWhatsAppBtn = document.getElementById('sendSimulationWhatsAppBtn');

// Formatador de Moeda BRL
function formatBRL(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0
    }).format(value);
}

// Atualizar limites do simulador ao trocar de segmento
function updateSimulatorBounds(segmentKey) {
    const config = SITE_CONFIG.segments[segmentKey];
    if (!config) return;

    creditRange.min = config.minCredit;
    creditRange.max = config.maxCredit;
    creditRange.step = config.stepCredit;
    creditRange.value = config.defaultCredit;

    monthsRange.min = config.minMonths;
    monthsRange.max = config.maxMonths;
    monthsRange.step = config.stepMonths;
    monthsRange.value = config.defaultMonths;

    minCreditLabel.textContent = formatBRL(config.minCredit);
    maxCreditLabel.textContent = formatBRL(config.maxCredit);
    minMonthsLabel.textContent = `${config.minMonths} meses`;
    maxMonthsLabel.textContent = `${config.maxMonths} meses`;

    calculateSimulation();
}

// Cálculo da simulação do consórcio
function calculateSimulation() {
    const config = SITE_CONFIG.segments[currentSegment];
    const credit = parseFloat(creditRange.value);
    const months = parseInt(monthsRange.value);
    const isReduced = reducedInstallmentToggle ? reducedInstallmentToggle.checked : false;

    // Atualizar displays visuais
    creditValueDisplay.textContent = formatBRL(credit);
    monthsValueDisplay.textContent = `${months} meses (${(months / 12).toFixed(1).replace('.0', '')} anos)`;

    // Custo Total = Crédito + Taxa de Adm + Fundo de Reserva
    const totalRate = 1 + config.adminFeeRate + config.reserveFundRate;
    const totalPlanValue = credit * totalRate;
    
    // Parcela Cheia
    let monthlyInstallment = totalPlanValue / months;

    // Se Parcela Reduzida estiver ativada
    if (isReduced) {
        monthlyInstallment = monthlyInstallment * config.reducedInstallmentFactor;
        installmentTypeBadge.textContent = "Parcela Reduzida (Até contemplação)";
        installmentTypeBadge.className = "inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30";
    } else {
        installmentTypeBadge.textContent = "Parcela Integral Estimada";
        installmentTypeBadge.className = "inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }

    // Atualiza Card de Resumo
    estimatedInstallmentDisplay.innerHTML = `${formatBRL(monthlyInstallment)}<span class="text-lg text-slate-400 font-normal">/mês</span>`;
    summarySegment.textContent = config.name;
    summaryCredit.textContent = formatBRL(credit);
    summaryMonths.textContent = `${months} meses`;

    // Atualiza Link do WhatsApp com mensagem pronta
    const planTypeStr = isReduced ? "Parcela Reduzida" : "Parcela Integral";
    const message = `Olá! Fiz uma simulação no site da ${SITE_CONFIG.companyName}:%0A%0A` +
        `🎯 *Segmento:* ${encodeURIComponent(config.name)}%0A` +
        `💰 *Valor da Carta:* ${encodeURIComponent(formatBRL(credit))}%0A` +
        `⏱️ *Prazo:* ${months} meses%0A` +
        `💵 *Parcela Estimada:* ${encodeURIComponent(formatBRL(monthlyInstallment))}/mês (${planTypeStr})%0A%0A` +
        `Gostaria de ver as tabelas e opções de grupos disponíveis!`;

    const waUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`;
    if (sendSimulationWhatsAppBtn) {
        sendSimulationWhatsAppBtn.href = waUrl;
    }
}

// Trocar Segmento Ativo
function selectSimulatorSegment(segmentKey) {
    currentSegment = segmentKey;

    // Atualizar botões visuais
    document.querySelectorAll('.segment-tab').forEach(tab => {
        if (tab.getAttribute('data-segment') === segmentKey) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    updateSimulatorBounds(segmentKey);

    // Rolar suavemente até o simulador se foi clicado a partir dos cards
    const simuladorEl = document.getElementById('simulador');
    if (simuladorEl) {
        simuladorEl.scrollIntoView({ behavior: 'smooth' });
    }
}

// Inicialização dos Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Configurar ano atual no footer
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Configurar todos os links de WhatsApp padrão com o número definido no SITE_CONFIG
    document.querySelectorAll('a[href*="wa.me/5511999999999"]').forEach(link => {
        link.href = link.href.replace('5511999999999', SITE_CONFIG.whatsappNumber);
    });

    // Segment Tabs no Simulador
    document.querySelectorAll('.segment-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const segment = tab.getAttribute('data-segment');
            selectSimulatorSegment(segment);
        });
    });

    // Sliders
    if (creditRange) creditRange.addEventListener('input', calculateSimulation);
    if (monthsRange) monthsRange.addEventListener('input', calculateSimulation);
    if (reducedInstallmentToggle) reducedInstallmentToggle.addEventListener('change', calculateSimulation);

    // Inicializar simulação padrão
    updateSimulatorBounds('imovel');

    // FAQ Accordion
    const faqButtons = document.querySelectorAll('.faq-button');
    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = !answer.classList.contains('hidden');

            // Fechar todos
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                if (otherAnswer) otherAnswer.classList.add('hidden');
            });

            // Alternar o atual
            if (!isOpen) {
                item.classList.add('active');
                answer.classList.remove('hidden');
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Fechar ao clicar em um link
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Form de Lead
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('nameInput').value.trim();
            const phone = document.getElementById('phoneInput').value.trim();
            const segment = document.getElementById('segmentSelect').value;
            const goalValue = document.getElementById('valueGoalInput').value.trim();

            const message = `Olá! Meu nome é *${encodeURIComponent(name)}*.%0A` +
                `Preenchi a solicitação no site da ${SITE_CONFIG.companyName}:%0A%0A` +
                `📱 *Telefone:* ${encodeURIComponent(phone)}%0A` +
                `🎯 *Segmento de Interesse:* ${encodeURIComponent(segment)}%0A` +
                `💰 *Valor Desejado:* ${encodeURIComponent(goalValue || 'A definir')}%0A%0A` +
                `Gostaria de receber a consultoria gratuita e opções de cartas disponíveis.`;

            const waUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`;
            window.open(waUrl, '_blank');
        });
    }
});

/**
 * MathLab 12B2 — Hệ thống xử lý toán học tối ưu
 * Thực hiện bởi Minh Nhựt
 * Phiên bản: 2.0 (Gộp logic dùng chung)
 */

// =====================================================
// CHEAT SHEET — MỞ / ĐÓNG SIDEBAR
// =====================================================
function toggleCS() {
    const sidebar = document.getElementById('cs-sidebar');
    const overlay = document.getElementById('cs-overlay');
    const btn = document.querySelector('.cs-toggle-btn');
    if (!sidebar) return;
    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('visible', isOpen);
    if (btn) btn.style.opacity = isOpen ? '0' : '1';
    if (btn) btn.style.pointerEvents = isOpen ? 'none' : 'all';
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function toggleSection(id) {
    const sec = document.getElementById(id);
    if (sec) sec.classList.toggle('collapsed');
}

// Đóng sidebar khi nhấn ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('cs-sidebar');
        if (sidebar && sidebar.classList.contains('open')) toggleCS();
    }
});

// =====================================================
// TOOLTIP — HOVER VÀO Ô NHẬP LIỆU (Dùng chung)
// =====================================================
function initTooltips(tooltipMap) {
    const tooltip = document.getElementById('field-tooltip');
    if (!tooltip) return;
    const ttLabel = document.getElementById('tt-label');
    const ttDesc = document.getElementById('tt-desc');
    const ttFormula = document.getElementById('tt-formula');

    let hideTimer = null;

    document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => {
        const data = tooltipMap[input.id];
        if (!data) return;

        input.addEventListener('mouseenter', (e) => {
            clearTimeout(hideTimer);
            ttLabel.textContent = data.label;
            ttDesc.textContent = data.desc;
            ttFormula.textContent = data.formula || '';
            ttFormula.style.display = data.formula ? 'block' : 'none';
            positionTooltip(e, tooltip);
            tooltip.classList.add('visible');
        });

        input.addEventListener('mousemove', (e) => positionTooltip(e, tooltip));

        input.addEventListener('mouseleave', () => {
            hideTimer = setTimeout(() => tooltip.classList.remove('visible'), 120);
        });

        input.addEventListener('focus', () => tooltip.classList.remove('visible'));
    });
}

function positionTooltip(e, tooltip) {
    const margin = 12;
    const tw = tooltip.offsetWidth || 260;
    const th = tooltip.offsetHeight || 90;
    let x = e.clientX + margin;
    let y = e.clientY - th - margin;
    if (x + tw > window.innerWidth - 10) x = e.clientX - tw - margin;
    if (y < 10) y = e.clientY + margin + 10;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

// =====================================================
// HÀM LẤY TÊN BIẾN CỐ (Dùng chung cho Probability & Bayes)
// =====================================================
function getNames() {
    const elA = document.getElementById('name-A') || document.getElementById('cond-name-A');
    const elB = document.getElementById('name-B') || document.getElementById('cond-name-B');
    const elNA = document.getElementById('name-notA') || document.getElementById('cond-name-notA');
    const elNB = document.getElementById('name-notB') || document.getElementById('cond-name-notB');

    const nA = elA?.value.trim() || 'A';
    const nB = elB?.value.trim() || 'B';
    const nNA = elNA?.value.trim() || (nA === 'A' ? "A'" : 'không ' + nA);
    const nNB = elNB?.value.trim() || (nB === 'B' ? "B'" : 'không ' + nB);
    return { A: nA, B: nB, nA: nNA, nB: nNB };
}

// =====================================================
// HÀM CẬP NHẬT NHÃN (Dùng chung)
// =====================================================
function updateLabels() {
    const n = getNames();
    const labelMap = {
        // --- Probability Page ---
        'lbl-pA': `P(${n.A}) — xác suất "${n.A}"`,
        'lbl-pB': `P(${n.B}) — xác suất "${n.B}"`,
        'lbl-pNotA': `P(${n.nA}) — bù của "${n.A}"`,
        'lbl-pNotB': `P(${n.nB}) — bù của "${n.B}"`,
        'lbl-pAnB': `P(${n.A} ∩ ${n.B}) — giao`,
        'lbl-pAuB': `P(${n.A} ∪ ${n.B}) — hợp`,
        'res-pA': `P(${n.A})`,
        'res-pNotA': `P(${n.nA})`,
        // --- Bayes (Conditional) Page ---
        'lbl-cA': `Nhập P(${n.A})`,
        'lbl-cNotA': `Nhập P(${n.nA})`,
        'lbl-node-A': `Biến cố "${n.A}"`,
        'lbl-node-nA': `Biến cố "${n.nA}"`,
        'lbl-cB_A': `P(${n.B}|${n.A})`,
        'lbl-cNotB_A': `P(${n.nB}|${n.A})`,
        'lbl-cB_notA': `P(${n.B}|${n.nA})`,
        'lbl-cNotB_notA': `P(${n.nB}|${n.nA})`,
        'lbl-pBT': `P(${n.B}) — toàn phần:`,
        'lbl-pBnotT': `P(${n.nB}) — toàn phần:`,
    };

    Object.entries(labelMap).forEach(([id, text]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    });
}

// =====================================================
// TÍNH TOÁN SƠ ĐỒ CÂY + BAYES (Dùng chung cho Probability)
// =====================================================
function calcTree() {
    const errEl = document.getElementById('msg-error');
    if (errEl) errEl.innerText = '';

    let pA = parseFloat(document.getElementById('cA').value);
    let pNotA = parseFloat(document.getElementById('cNotA').value);
    const pB_A = parseFloat(document.getElementById('cB_A').value) || 0;
    const pNB_A = parseFloat(document.getElementById('cNotB_A').value) || 0;
    const pB_nA = parseFloat(document.getElementById('cB_notA').value) || 0;
    const pNB_nA = parseFloat(document.getElementById('cNotB_notA').value) || 0;

    if (isNaN(pA) && isNaN(pNotA)) return;
    if (isNaN(pA)) pA = 1 - pNotA;
    if (isNaN(pNotA)) pNotA = 1 - pA;

    if (pA < 0 || pA > 1 || pNotA < 0 || pNotA > 1) {
        if (errEl) errEl.innerText = '⚠️ P(A) và P(A\') phải nằm trong [0, 1]';
        return;
    }
    if (Math.abs(pA + pNotA - 1) > 1e-4) {
        if (errEl) errEl.innerText = '⚠️ P(A) + P(A\') phải bằng 1. Hiện tại: ' + smartRound(pA + pNotA);
        return;
    }

    const pAB = pA * pB_A;
    const pANB = pA * pNB_A;
    const pNAB = pNotA * pB_nA;
    const pNANB = pNotA * pNB_nA;

    setVal('rAB', pAB);
    setVal('rAnBnot', pANB);
    setVal('rnotAB', pNAB);
    setVal('rnotAnBnot', pNANB);

    const pB = pAB + pNAB;
    const pBnot = pANB + pNANB;

    setInput('pBT_input', pB);
    setInput('pBnotT_input', pBnot);

    if (pB > 1e-9) {
        setInput('pAgB_input', pAB / pB);
        setInput('pNotAgB_input', pNAB / pB);
    } else {
        clearInput('pAgB_input');
        clearInput('pNotAgB_input');
    }

    if (pBnot > 1e-9) {
        setInput('pAgBnot_input', pANB / pBnot);
        setInput('pNotAgBnot_input', pNANB / pBnot);
    } else {
        clearInput('pAgBnot_input');
        clearInput('pNotAgBnot_input');
    }
}

// =====================================================
// RESET
// =====================================================
function resetTree() {
    ['cA','cNotA','cB_A','cNotB_A','cB_notA','cNotB_notA'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    ['rAB','rAnBnot','rnotAB','rnotAnBnot'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = '0';
    });
    ['pBT_input','pBnotT_input','pAgB_input','pNotAgB_input',
     'pAgBnot_input','pNotAgBnot_input'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const errEl = document.getElementById('msg-error');
    if (errEl) errEl.innerText = '';
}

// =====================================================
// UTILS
// =====================================================
function smartRound(num) { return Math.round(num * 10000) / 10000; }

function setVal(id, v) {
    const el = document.getElementById(id);
    if (el) el.innerText = smartRound(v);
}

function setInput(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = smartRound(v);
}

function clearInput(id) {
    const el = document.getElementById(id);
    if (el) el.value = '';
}
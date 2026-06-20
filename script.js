/**
 * MathLab 12B2 — Hệ thống xử lý toán học tối ưu
 * Thực hiện bởi Minh Nhựt
 */

// =====================================================
// CHEAT SHEET — MỞ / ĐÓNG SIDEBAR
// =====================================================
function toggleCS() {
    const sidebar = document.getElementById('cs-sidebar');
    const overlay = document.getElementById('cs-overlay');
    const btn     = document.querySelector('.cs-toggle-btn');
    if (!sidebar) return;
    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('visible', isOpen);
    if (btn) btn.style.opacity      = isOpen ? '0' : '1';
    if (btn) btn.style.pointerEvents = isOpen ? 'none' : 'all';
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function toggleSection(id) {
    const sec = document.getElementById(id);
    if (sec) sec.classList.toggle('collapsed');
}

// =====================================================
// TOOLTIP KHI HOVER VÀO Ô NHẬP LIỆU
// =====================================================
function initTooltips(tooltipMap) {
    const tooltip   = document.getElementById('field-tooltip');
    const ttLabel   = document.getElementById('tt-label');
    const ttDesc    = document.getElementById('tt-desc');
    const ttFormula = document.getElementById('tt-formula');
    if (!tooltip) return;

    let hideTimer = null;

    document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => {
        const data = tooltipMap[input.id];
        if (!data) return;

        input.addEventListener('mouseenter', (e) => {
            clearTimeout(hideTimer);
            ttLabel.textContent = data.label;
            ttDesc.textContent  = data.desc;
            if (data.formula) {
                ttFormula.textContent   = data.formula;
                ttFormula.style.display = 'block';
            } else {
                ttFormula.style.display = 'none';
            }
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
    const tw = tooltip.offsetWidth  || 260;
    const th = tooltip.offsetHeight || 90;
    let x = e.clientX + margin;
    let y = e.clientY - th - margin;
    if (x + tw > window.innerWidth  - 10) x = e.clientX - tw - margin;
    if (y < 10) y = e.clientY + margin + 10;
    tooltip.style.left = x + 'px';
    tooltip.style.top  = y + 'px';
}

// Đóng sidebar khi nhấn ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('cs-sidebar');
        if (sidebar && sidebar.classList.contains('open')) toggleCS();
    }
});

// =====================================================
// HÀM LẤY TÊN BIẾN CỐ (dùng chung cho cả 2 trang)
// =====================================================
function getNames() {
    const nA  = document.getElementById('name-A')   ?.value.trim() || 'A';
    const nB  = document.getElementById('name-B')   ?.value.trim() || 'B';
    const nNA = document.getElementById('name-notA')?.value.trim() || (nA === 'A' ? "A'" : 'không ' + nA);
    const nNB = document.getElementById('name-notB')?.value.trim() || (nB === 'B' ? "B'" : 'không ' + nB);
    return { A: nA, B: nB, nA: nNA, nB: nNB };
}

// Cập nhật nhãn trang probability.html
function updateProbLabels() {
    const n = getNames();
    const map = {
        'lbl-pA':             `P(${n.A}) — xác suất "${n.A}"`,
        'lbl-pB':             `P(${n.B}) — xác suất "${n.B}"`,
        'lbl-pNotA':          `P(${n.nA}) — bù của "${n.A}"`,
        'lbl-pNotB':          `P(${n.nB}) — bù của "${n.B}"`,
        'lbl-pAnB':           `P(${n.A} ∩ ${n.B}) — giao`,
        'lbl-pAuB':           `P(${n.A} ∪ ${n.B}) — hợp`,
        'res-lbl-pA':         `P(${n.A})`,
        'res-lbl-pB':         `P(${n.B})`,
        'res-lbl-pNotA':      `P(${n.nA}) = 1 − P(${n.A})`,
        'res-lbl-pNotB':      `P(${n.nB}) = 1 − P(${n.B})`,
        'res-lbl-pAnB':       `P(${n.A} ∩ ${n.B}) — giao`,
        'res-lbl-pAuB':       `P(${n.A} ∪ ${n.B}) — hợp`,
        'res-lbl-pAnBnot':    `P(${n.A} ∩ ${n.nB}) = P(${n.A}) − P(${n.A}∩${n.B})`,
        'res-lbl-pNotAnB':    `P(${n.nA} ∩ ${n.B}) = P(${n.B}) − P(${n.A}∩${n.B})`,
        'res-lbl-pNotAnBnot': `P(${n.nA} ∩ ${n.nB}) = 1 − P(${n.A}∪${n.B})`,
        'res-lbl-pAxB':       `P(${n.A} △ ${n.B}) — hiệu xứng`,
        'res-lbl-doclap':     `Độc lập? (${n.A}∩${n.B} = P(${n.A})·P(${n.B}))`,
        'res-lbl-xungkhac':   `Xung khắc? (${n.A}∩${n.B} = 0)`,
    };
    Object.entries(map).forEach(([id, text]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    });
}

// Cập nhật nhãn trang conditional.html
function updateTreeLabels() {
    const n = getNames();
    const map = {
        'lbl-cA':           `Nhập P(${n.A})`,
        'lbl-cNotA':        `Nhập P(${n.nA})`,
        'lbl-node-A':       `Biến cố "${n.A}"`,
        'lbl-node-nA':      `Biến cố "${n.nA}"`,
        'lbl-cB_A':         `P(${n.B}|${n.A})`,
        'lbl-cNotB_A':      `P(${n.nB}|${n.A})`,
        'lbl-cB_notA':      `P(${n.B}|${n.nA})`,
        'lbl-cNotB_notA':   `P(${n.nB}|${n.nA})`,
        'lbl-pBT':          `P(${n.B}) — toàn phần:`,
        'lbl-pBnotT':       `P(${n.nB}) — toàn phần:`,
        'lbl-bayes-B':      `🔵 BAYES — BIẾT "${n.B}" ĐÃ XẢY RA`,
        'lbl-pAgB':         `P(${n.A}|${n.B}) — Bayes:`,
        'lbl-pNotAgB':      `P(${n.nA}|${n.B}) — Bayes:`,
        'lbl-bayes-Bnot':   `🟡 BAYES — BIẾT "${n.nB}" ĐÃ XẢY RA`,
        'lbl-pAgBnot':      `P(${n.A}|${n.nB}) — Bayes:`,
        'lbl-pNotAgBnot':   `P(${n.nA}|${n.nB}) — Bayes:`,
        'lbl-rAB':          `P(${n.A}∩${n.B})`,
        'lbl-rAnBnot':      `P(${n.A}∩${n.nB})`,
        'lbl-rnotAB':       `P(${n.nA}∩${n.B})`,
        'lbl-rnotAnBnot':   `P(${n.nA}∩${n.nB})`,
    };
    Object.entries(map).forEach(([id, text]) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    });
}

// =====================================================
// BLUR — tự điền ô bù (conditional.html)
// =====================================================
document.addEventListener('blur', (e) => {
    const id = e.target.id;
    if (!document.getElementById('cA')) return;

    const pairs = [
        ['cA', 'cNotA'],         ['cNotA', 'cA'],
        ['cB_A', 'cNotB_A'],     ['cNotB_A', 'cB_A'],
        ['cB_notA', 'cNotB_notA'], ['cNotB_notA', 'cB_notA'],
    ];
    pairs.forEach(([src, tgt]) => {
        if (id === src) {
            const val = parseFloat(document.getElementById(src).value);
            if (!isNaN(val) && document.getElementById(tgt).value === '')
                document.getElementById(tgt).value = smartRound(1 - val);
        }
    });
    calcTree();
}, true);

// =====================================================
// INPUT — lắng nghe tất cả ô nhập liệu
// =====================================================
document.addEventListener('input', (e) => {
    const targetId = e.target.id;
    const errorEl  = document.getElementById('prob-error');
    if (errorEl) errorEl.innerText = '';

    // Cập nhật nhãn khi gõ tên biến cố
    if (['name-A','name-B','name-notA','name-notB'].includes(targetId)) {
        if (document.getElementById('pA')) updateProbLabels();
        if (document.getElementById('cA')) updateTreeLabels();
        return;
    }

    // 1. XÁC SUẤT THƯỜNG (probability.html)
    if (document.getElementById('pA')) {
        let pA   = parseFloat(document.getElementById('pA').value)   || 0;
        let pB   = parseFloat(document.getElementById('pB').value)   || 0;
        let pAnB = parseFloat(document.getElementById('pAnB').value) || 0;
        const mode = document.querySelector('input[name="mode"]:checked').value;

        if (mode === 'xungkhac') {
            pAnB = 0;
            document.getElementById('pAnB').value = 0;
        } else if (mode === 'doclap') {
            pAnB = pA * pB;
            document.getElementById('pAnB').value = smartRound(pAnB);
        }

        const pNotA = 1 - pA;
        const pNotB = 1 - pB;
        const pAuB  = pA + pB - pAnB;

        if (targetId === 'pA')    document.getElementById('pNotA').value = smartRound(pNotA);
        if (targetId === 'pNotA') {
            pA = 1 - (parseFloat(document.getElementById('pNotA').value) || 0);
            document.getElementById('pA').value = smartRound(pA);
        }
        if (targetId === 'pB')    document.getElementById('pNotB').value = smartRound(pNotB);
        if (targetId === 'pNotB') {
            pB = 1 - (parseFloat(document.getElementById('pNotB').value) || 0);
            document.getElementById('pB').value = smartRound(pB);
        }

        setVal('res-pA',         pA);
        setVal('res-pB',         pB);
        setVal('res-pNotA',      pNotA);
        setVal('res-pNotB',      pNotB);
        setVal('res-pAnB',       pAnB);
        setVal('res-pAuB',       pAuB);
        setVal('res-pAnBnot',    pA - pAnB);
        setVal('res-pNotAnB',    pB - pAnB);
        setVal('res-pNotAnBnot', 1 - pAuB);
        setVal('res-pAxB',       (pA - pAnB) + (pB - pAnB));

        const isXungKhac = pAnB === 0;
        const isDocLap   = Math.abs(pAnB - pA * pB) < 1e-6;
        document.getElementById('res-xungkhac').innerText = isXungKhac ? 'Có ✅' : 'Không ❌';
        document.getElementById('res-doclap').innerText   = isDocLap   ? 'Có ✅' : 'Không ❌';
        document.getElementById('prob-status').innerText  = 'Đã cập nhật dữ liệu.';
    }

    // 2. ĐIỀU KIỆN + BAYES (conditional.html)
    if (document.getElementById('cA')) {
        calcTree();
    }
});

// =====================================================
// TÍNH TOÁN SƠ ĐỒ CÂY + BAYES
// =====================================================
function calcTree() {
    const errEl = document.getElementById('msg-error');
    if (errEl) errEl.innerText = '';

    let pA    = parseFloat(document.getElementById('cA').value);
    let pNotA = parseFloat(document.getElementById('cNotA').value);
    const pB_A   = parseFloat(document.getElementById('cB_A').value)       || 0;
    const pNB_A  = parseFloat(document.getElementById('cNotB_A').value)    || 0;
    const pB_nA  = parseFloat(document.getElementById('cB_notA').value)    || 0;
    const pNB_nA = parseFloat(document.getElementById('cNotB_notA').value) || 0;

    if (isNaN(pA) && isNaN(pNotA)) return;
    if (isNaN(pA))    pA    = 1 - pNotA;
    if (isNaN(pNotA)) pNotA = 1 - pA;

    if (pA < 0 || pA > 1 || pNotA < 0 || pNotA > 1) {
        if (errEl) errEl.innerText = '⚠️ P(A) và P(A\') phải nằm trong [0, 1]';
        return;
    }
    if (Math.abs(pA + pNotA - 1) > 1e-4) {
        if (errEl) errEl.innerText = '⚠️ P(A) + P(A\') phải bằng 1. Hiện tại: ' + smartRound(pA + pNotA);
        return;
    }

    const pAB   = pA    * pB_A;
    const pANB  = pA    * pNB_A;
    const pNAB  = pNotA * pB_nA;
    const pNANB = pNotA * pNB_nA;

    setVal('rAB',        pAB);
    setVal('rAnBnot',    pANB);
    setVal('rnotAB',     pNAB);
    setVal('rnotAnBnot', pNANB);

    const pB    = pAB  + pNAB;
    const pBnot = pANB + pNANB;

    setInput('pBT_input',    pB);
    setInput('pBnotT_input', pBnot);

    if (pB > 1e-9) {
        setInput('pAgB_input',    pAB  / pB);
        setInput('pNotAgB_input', pNAB / pB);
    } else {
        clearInput('pAgB_input');
        clearInput('pNotAgB_input');
    }

    if (pBnot > 1e-9) {
        setInput('pAgBnot_input',    pANB  / pBnot);
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
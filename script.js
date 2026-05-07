document.addEventListener('input', (e) => {
    // 1. Logic Xác suất thường
    if (document.getElementById('pA')) {
        const pA = parseFloat(document.getElementById('pA').value) || 0;
        const pB = parseFloat(document.getElementById('pB').value) || 0;
        const mode = document.querySelector('input[name="mode"]:checked').value;
        const inAnB = document.getElementById('pAnB');
        let pAnB = parseFloat(inAnB.value) || 0;

        if (mode === 'xungkhac') { pAnB = 0; inAnB.value = 0; }
        if (mode === 'doclap') { pAnB = pA * pB; inAnB.value = pAnB.toFixed(4); }

        setVal('resNotA', 1 - pA); setVal('resNotB', 1 - pB); setVal('resAorB', pA + pB - pAnB);
    }

    // 2. Logic Tần số
    if (document.getElementById('nOmega')) {
        const nO = parseFloat(document.getElementById('nOmega').value) || 0;
        const nA = parseFloat(document.getElementById('nA').value) || 0;
        const nB = parseFloat(document.getElementById('nB').value) || 0;
        const nAnB = parseFloat(document.getElementById('nAnB_f').value) || 0;
        if (nO > 0) {
            setVal('pA_f', nA/nO); setVal('pB_f', nB/nO);
            const nU = nA + nB - nAnB;
            document.getElementById('nU').innerText = nU;
            setVal('pU', nU/nO);
        }
    }

    // 3. Logic Điều kiện (Tự động bù trừ 1-x)
    if (document.getElementById('cA')) {
        const pA = parseFloat(document.getElementById('cA').value) || 0;
        if(e.target.id === 'cA') document.getElementById('cNotA').value = (1 - pA).toFixed(2);
        if(e.target.id === 'cNotA') document.getElementById('cA').value = (1 - parseFloat(e.target.value)).toFixed(2);

        const pBgA = parseFloat(document.getElementById('cB_A').value) || 0;
        if(e.target.id === 'cB_A') document.getElementById('cNotB_A').value = (1 - pBgA).toFixed(2);

        const pBgNotA = parseFloat(document.getElementById('cB_notA').value) || 0;
        if(e.target.id === 'cB_notA') document.getElementById('cNotB_notA').value = (1 - pBgNotA).toFixed(2);

        const pBT = (pA * pBgA) + ((1-pA) * pBgNotA);
        setVal('rAB', pA * pBgA);
        setVal('rAnBnot', pA * (1-pBgA));
        setVal('rnotAB', (1-pA) * pBgNotA);
        setVal('rnotAnBnot', (1-pA) * (1-pBgNotA));
        setVal('pBT', pBT);
        if(pBT > 0) setVal('pBayes', (pA * pBgA) / pBT);
    }
});

function setVal(id, v) { const el = document.getElementById(id); if(el) el.innerText = v.toFixed(4); }
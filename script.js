document.addEventListener("DOMContentLoaded", () => {
    const inputBox = document.getElementById("inputBox");
    const outputBox = document.getElementById("outputBox");
    const generateBtn = document.getElementById("generateBtn");
    const copyBtn = document.getElementById("copyBtn");
    const showColorsBtn = document.getElementById("showColorsBtn");
    const showSelectorsBtn = document.getElementById("showSelectorsBtn");
    const colorInfo = document.getElementById("colorInfo");
    const selectorInfo = document.getElementById("selectorInfo");

    const colorMap = {
      '0': 'ดำ','1': 'น้ำเงินเข้ม','2': 'เขียว','3': 'น้ำเงินเขียว','4': 'แดง',
      '5': 'ม่วง','6': 'ส้ม','7': 'เทาอ่อน','8': 'เทาเข้ม','9': 'น้ำเงิน',
      'a': 'เขียวอ่อน','b': 'ฟ้า','c': 'แดงอ่อน','d': 'ม่วงอ่อน','e': 'เหลือง','f': 'ขาว'
    };

    const selectorMap = {
        '@a': 'ทุกคน',
        '@s': 'ตัวเอง',
        '@e': 'ทุก entity',
        '@r': 'สุ่มผู้เล่น',
        '@p': 'ผู้เล่นใกล้สุด'
    };

    function parseInput(text) {
        let result = [];
        const lines = text.split("\n");
        lines.forEach((line, i) => {
            if (i > 0) result.push({ text: "\n" });
            let currentText = "";
            const pattern = /(\{score:[a-zA-Z0-9_]+\})|(@[aeprs])|(§[0-9a-fk-or])|([^{§@]+)/g;
            let match;
            while ((match = pattern.exec(line)) !== null) {
                if (match[1]) {
                    if (currentText) { result.push({ text: currentText }); currentText=""; }
                    const objective = match[1].match(/\{score:([a-zA-Z0-9_]+)\}/)[1];
                    result.push({ score: { name: "@s", objective } });
                } else if (match[2]) {
                    if (currentText) { result.push({ text: currentText }); currentText=""; }
                    result.push({ selector: match[2] });
                } else if (match[3]) {
                    currentText += match[3];
                } else if (match[4]) {
                    currentText += match[4];
                }
            }
            if (currentText) result.push({ text: currentText });
        });
        return result;
    }

    generateBtn.addEventListener("click", () => {
        const userInput = inputBox.value.trim();
        if (!userInput) { alert("กรอกข้อความก่อนสิ"); return; }
        try {
            const parsed = parseInput(userInput);
            const rawtextJson = { rawtext: parsed };
            const minified = JSON.stringify(rawtextJson);
            const finalCommand = `execute as @a run titleraw @s actionbar ${minified}`;
            outputBox.value = finalCommand;
        } catch (err) {
            alert("เกิดข้อผิดพลาด: " + err.message);
        }
    });

    copyBtn.addEventListener("click", () => {
        if (outputBox.value) {
            navigator.clipboard.writeText(outputBox.value);
            alert("ก็อปคำสั่งเรียบร้อยแล้ว");
        } else { alert("ยังไม่มีอะไรจะก๊อปนะเพื่อน"); }
    });

    showColorsBtn.addEventListener("click", () => {
        let info = "";
        for (const code in colorMap) {
            info += `§${code} = ${colorMap[code]}\n`;
        }
        colorInfo.textContent = info;
    });

    showSelectorsBtn.addEventListener("click", () => {
        let info = "";
        for (const sel in selectorMap) {
            info += `${sel} = ${selectorMap[sel]}\n`;
        }
        selectorInfo.textContent = info;
    });
});

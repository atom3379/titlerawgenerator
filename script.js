document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");
    const inputBox = document.getElementById("inputBox");
    const outputBox = document.getElementById("outputBox");
    const colorInfo = document.getElementById("colorInfo");
    const selectorInfo = document.getElementById("selectorInfo");
    const statusBox = document.createElement("div");
    statusBox.className = "statusBox";
    container.appendChild(statusBox);

    const colorMap = {
        '0':'ดำ','1':'น้ำเงินเข้ม','2':'เขียว','3':'น้ำเงินเขียว','4':'แดง',
        '5':'ม่วง','6':'ส้ม','7':'เทาอ่อน','8':'เทาเข้ม','9':'น้ำเงิน',
        'a':'เขียวอ่อน','b':'ฟ้า','c':'แดงอ่อน','d':'ม่วงอ่อน','e':'เหลือง','f':'ขาว'
    };
    const selectorMap = {
        '@a':'ทุกคน','@s':'ตัวเอง','@e':'ทุก entity','@r':'สุ่มผู้เล่น','@p':'ผู้เล่นใกล้สุด'
    };

    function showStatus(msg, type="info", duration=2000){
        statusBox.textContent = msg;
        statusBox.style.opacity = "1";
        statusBox.style.backgroundColor = type==="error"?"#f44336":"#5cdb5c";
        setTimeout(()=>statusBox.style.opacity="0", duration);
    }

    function parseInput(text){
        let result = [];
        text.split("\n").forEach((line,i)=>{
            if(i>0) result.push({text:"\n"});
            line.replace(/(\{score:[\w]+\})|(@[aeprs])|(§[0-9a-fk-or])|([^{§@]+)/g, (match, score, selector, color, normal)=>{
                if(score){
                    result.push({score:{name:"@s",objective:score.match(/\{score:([\w]+)\}/)[1]}});
                } else if(selector){
                    result.push({selector});
                } else if(color){
                    result.push({text:color});
                } else if(normal){
                    result.push({text:normal});
                }
            });
        });
        return result;
    }

    function toggleBox(box, content){
        if(!box.classList.contains("show")){
            box.textContent = content;
            box.classList.add("show");
        } else {
            box.classList.remove("show");
        }
    }

    container.addEventListener("click", e => {
        const id = e.target.id;
        if(id==="generateBtn"){
            const userInput = inputBox.value.trim();
            if(!userInput){ showStatus("กรอกข้อความก่อนสิ", "error"); return; }
            try{
                const parsed = parseInput(userInput);
                const minified = JSON.stringify({rawtext:parsed});
                outputBox.value = `execute as @a run titleraw ${minified}`;
                showStatus("Generate เสร็จแล้ว");
            } catch(err){ showStatus("เกิดข้อผิดพลาด", "error"); }
        }
        else if(id==="copyBtn"){
            if(outputBox.value){
                navigator.clipboard.writeText(outputBox.value)
                    .then(()=>showStatus("ก็อปคำสั่งเรียบร้อยแล้ว"))
                    .catch(()=>showStatus("เบราว์เซอร์ไม่รองรับ copy", "error"));
            } else showStatus("ยังไม่มีอะไรจะก๊อปนะเพื่อน", "error");
        }
        else if(id==="toggleColorsBtn"){
            const info = Object.entries(colorMap).map(([k,v])=>`§${k} = ${v}`).join("\n");
            toggleBox(colorInfo, info);
        }
        else if(id==="toggleSelectorsBtn"){
            const info = Object.entries(selectorMap).map(([k,v])=>`${k} = ${v}`).join("\n");
            toggleBox(selectorInfo, info+"\n{score:ตัวอย่างคะแนน} = แทนคะแนนของตัวเอง");
        }
    });
});

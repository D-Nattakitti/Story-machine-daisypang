let selectedCan = null;
let coin = 0;
const validCodes = {
  'meow123': 3,
  'catlover': 5,
  'cutiecoin': 10
};

window.onload = () => {
  const grid = document.getElementById('cans-grid');
  for (let i = 0; i < 20; i++) {
    const can = document.createElement('div');
    can.className = 'can';
    can.onclick = () => selectCan(i);
    can.dataset.index = i;
    grid.appendChild(can);
  }
};

function selectCan(index) {
  document.querySelectorAll('.can').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.can')[index].classList.add('selected');
  selectedCan = index;
}

function dropCan() {
  if (coin <= 0) {
    alert("เหรียญไม่พอจ้า! เติมก่อนน้า~");
    return;
  }

  if (selectedCan === null) {
    alert("เลือกกระป๋องก่อนน้า~");
    return;
  }

  coin--;
  document.getElementById('coin-count').innerText = coin;

  const result = `น้อนแมวจากกระป๋องที่ ${selectedCan + 1} ปรากฏตัว! 🐱✨ <br><a href='result.html' target='_blank'>ไปดูรูป</a>`;
  document.getElementById('output-area').innerHTML = result;
}

function redeemCode() {
  const code = document.getElementById('code-box').value.trim();
  if (validCodes[code]) {
    coin += validCodes[code];
    alert(`เติมเหรียญสำเร็จ +${validCodes[code]} เหรียญ!`);
    document.getElementById('coin-count').innerText = coin;
    document.getElementById('code-box').value = '';
  } else {
    alert("รหัสไม่ถูกต้อง ลองใหม่อีกที!");
  }
}

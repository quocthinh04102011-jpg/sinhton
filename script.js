// ===== BUNKER SURVIVAL =====

let day = 1;
const maxDay = 30;

let water = 100;
let food = 100;
let power = 100;
let oxygen = 100;

let eventHistory = [];

const events = [
{
name:"🌪️ Bão bụi",
text:"Bão bụi làm hỏng kho thực phẩm.",
food:-20
},
{
name:"💨 Rò rỉ oxy",
text:"Hệ thống oxy bị rò rỉ.",
oxygen:-30
},
{
name:"⚡ Thiết bị quá tải",
text:"Máy phát bị quá tải.",
power:-25
},
{
name:"💧 Phát hiện kho nước",
text:"Bạn tìm thấy kho nước sạch.",
water:30
},
{
name:"🥫 Kho thực phẩm",
text:"Bạn tìm được nhiều đồ hộp.",
food:30
},
{
name:"🔋 Pin dự phòng",
text:"Nhặt được pin dự phòng.",
power:20
},
{
name:"🌱 Hạt giống",
text:"Nhặt được hạt giống.",
food:15,
water:-5
},
{
name:"☢️ Phóng xạ",
text:"Máy lọc hoạt động mạnh.",
power:-15,
oxygen:-10
},
{
name:"🚰 Đường ống vỡ",
text:"Mất nhiều nước.",
water:-20
},
{
name:"🎁 Người sống sót",
text:"Họ chia sẻ tài nguyên.",
water:15,
food:15,
power:10,
oxygen:10
}
];

function updateUI(){

document.getElementById("day").innerText = day;

document.getElementById("waterText").innerText = water;
document.getElementById("foodText").innerText = food;
document.getElementById("powerText").innerText = power;
document.getElementById("oxygenText").innerText = oxygen;

document.getElementById("waterBar").style.width = water + "%";
document.getElementById("foodBar").style.width = food + "%";
document.getElementById("powerBar").style.width = power + "%";
document.getElementById("oxygenBar").style.width = oxygen + "%";

checkWarning();

}

function log(text){

const box=document.getElementById("log");

box.innerHTML+="<br>"+text;

box.scrollTop=box.scrollHeight;

}

function checkWarning(){

if(water<20) log("⚠️ Nước sắp cạn!");
if(food<20) log("⚠️ Thực phẩm sắp hết!");
if(power<20) log("⚠️ Điện rất thấp!");
if(oxygen<20) log("⚠️ Oxy nguy hiểm!");

}
// ===== HÀNH ĐỘNG =====

function action(choice){

switch(choice){

case 1:
// Tìm kiếm
water += 15;
food += 20;
power -= 10;
log("🔍 Bạn ra ngoài tìm kiếm.");
break;

case 2:
// Lọc nước
water += 25;
power -= 10;
log("💧 Bạn lọc được nước sạch.");
break;

case 3:
// Trồng rau
food += 20;
water -= 10;
log("🌱 Bạn chăm sóc vườn rau.");
break;

case 4:
// Sửa máy phát
power += 25;
oxygen -= 10;
log("⚡ Máy phát đã được sửa.");
break;

case 5:
// Nghỉ ngơi
log("😴 Bạn nghỉ ngơi.");
water -= 2.5;
food -= 4;
power -= 1.5;
oxygen -= 1;
endDay(true);
return;

}

endDay(false);

}

// ===== KẾT THÚC NGÀY =====

function endDay(rest){

if(!rest){

water -= 5;
food -= 8;
power -= 3;
oxygen -= 2;

}

// Giới hạn tối đa
water = Math.min(100, water);
food = Math.min(100, food);
power = Math.min(100, power);
oxygen = Math.min(100, oxygen);

// 30% xảy ra sự kiện
if(Math.random() < 0.3){

let e = events[Math.floor(Math.random()*events.length)];

if(e.water) water += e.water;
if(e.food) food += e.food;
if(e.power) power += e.power;
if(e.oxygen) oxygen += e.oxygen;

eventHistory.push(e.name);

log("<b>" + e.name + "</b><br>" + e.text);

}

// Không vượt quá 100
water = Math.min(100, water);
food = Math.min(100, food);
power = Math.min(100, power);
oxygen = Math.min(100, oxygen);

// Không âm quá
water = Math.max(-100, water);
food = Math.max(-100, food);
power = Math.max(-100, power);
oxygen = Math.max(-100, oxygen);

day++;

updateUI();

checkGame();

} 
// ===== KIỂM TRA THẮNG / THUA =====

function checkGame(){

    if(water < 0 || food < 0 || power < 0 || oxygen < 0){

        alert(
`☠️ GAME OVER!

Bạn sống được ${day-1} ngày.

Sự kiện đã gặp:
${eventHistory.join("\n")}`
        );

        localStorage.removeItem("bunkerSave");
        return;
    }

    if(day > maxDay){

        let score = water + food + power + oxygen;

        let rank = "D";

        if(score >= 100) rank = "C";
        if(score >= 180) rank = "B";
        if(score >= 260) rank = "A";
        if(score >= 340) rank = "S";

        alert(
`🏆 CHIẾN THẮNG!

Bạn sống sót đủ 30 ngày.

Điểm: ${score}

Xếp hạng: ${rank}`
        );

        localStorage.removeItem("bunkerSave");
        return;
    }

    saveGame();

}

// ===== LƯU GAME =====

function saveGame(){

    const save = {

        day,
        water,
        food,
        power,
        oxygen,
        eventHistory

    };

    localStorage.setItem(
        "bunkerSave",
        JSON.stringify(save)
    );

}

// ===== TẢI GAME =====

function loadGame(){

    const data = localStorage.getItem("bunkerSave");

    if(!data){

        updateUI();
        return;

    }

    const save = JSON.parse(data);

    day = save.day;
    water = save.water;
    food = save.food;
    power = save.power;
    oxygen = save.oxygen;
    eventHistory = save.eventHistory || [];

    updateUI();

    log("💾 Đã tải dữ liệu đã lưu.");

}

// ===== CHƠI LẠI =====

function restartGame(){

    day = 1;

    water = 100;
    food = 100;
    power = 100;
    oxygen = 100;

    eventHistory = [];

    document.getElementById("log").innerHTML =
        "Game bắt đầu...";

    localStorage.removeItem("bunkerSave");

    updateUI();

}

// ===== KHỞI TẠO =====

loadGame();
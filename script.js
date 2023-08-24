let spin = true; // スピン開始・停止切り替えの変数
let once = false; // 一回のみ実行するための変数
let stopL = true, stopC = true, stopR = true; // リールを停止するための変数
let stopPCL = true, stopPCC = true, stopPCR = true // リール修正後か確認用の変数
let animationL, animationC, animationR, // リールアニメーションの変数
    animationLcorr, animationCcorr, animationRcorr; // リール修正アニメーションの変数
let pCnumL = 0, pCnumC = 0, pCnumR = 0; // リール結果格納するための変数
let totalWinMoney = 0; // これまで勝ち取った金額
let winMoney = 0; // 勝った金額
let nowBet = 0; // 今の掛け金
let rSEcheck = false; // リールスピンSE
let bgmcheck = false; // BGMSE



//HTMLロード時実行
window.addEventListener('DOMContentLoaded', function () {
    const betPlus = document.getElementById("betPlusBtn");
    betPlus.disabled = true; // プラスボタンを押せないようにする
    const betMinus = document.getElementById("betMinusBtn");
    betMinus.disabled = true; // マイナスボタンを押せないようにする
});


// 金額メニューを表示
function toggleMoneyMenu() {
    const moneyMenuBtn = document.getElementById("moneyMenuBtn");
    moneyMenuBtn.classList.toggle("active");
}



// 案内メニューを表示
function toggleInfoMenu() {
    const infoMenuBtn = document.getElementById("infoMenuBtn");
    infoMenuBtn.classList.toggle("active");
}



// 所持金を増やす
function betAdd(addNum) {
    // 所持金増加
    const coinButton = document.getElementById("coinBtn");
    const currentValue = parseInt(coinButton.value.replace("\\", "")) + addNum;;
    coinButton.value = '\\' + currentValue;
    const moneySE = document.getElementById("moneySE");
    moneySE.volume = 0.1; // 音量
    moneySE.play();
    setTimeout(function () {
        moneySE.pause(); // 一時停止
        moneySE.currentTime = 0;
    }, 1300);


    const betPlus = document.getElementById("betPlusBtn");
    betPlus.disabled = false; // プラスボタンを押せるようにする
}




// spinBtnをクリックしたときに実行
function spinAndStop() {
    const imageL = document.getElementById("imageL"); // 画像を取得
    const imageC = document.getElementById("imageC"); // 画像を取得
    const imageR = document.getElementById("imageR"); // 画像を取得
    const currentPositionL = getComputedStyle(imageL).transform; // 現在の位置を取得
    const currentPositionC = getComputedStyle(imageC).transform; // 現在の位置を取得
    const currentPositionR = getComputedStyle(imageR).transform; // 現在の位置を取得
    const betPlus = document.getElementById("betPlusBtn"); // 掛け金プラスボタン取得
    const betMinus = document.getElementById("betMinusBtn"); // 掛け金マイナスボタン取得
    const spinBtn = document.getElementById("spinBtn");
    const coinBtn = document.getElementById("coinBtn");
    const moneyMenuBtn = document.getElementById("moneyMenuBtn");
    const nowWin = document.getElementById("nowWin");
    nowWin.innerHTML = 0;

    stopL = false;
    stopC = false;
    stopR = false;
    stopPCL = false;
    stopPCC = false;
    stopPCR = false;
    spinBtn.disabled = true; // ボタン無効化
    betPlus.disabled = true; // ボタン無効化
    betMinus.disabled = true; // ボタン無効化
    coinBtn.disabled = true; // ボタン無効化
    if (moneyMenuBtn.classList.contains("active")) {
        // active クラスが付与されている場合の処理（メニューを閉じる）
        moneyMenuBtn.classList.remove("active");
    }


    // 所持金を掛け金分減らす
    const coinButton = document.getElementById("coinBtn");
    const currentValue = parseInt(coinButton.value.replace("\\", "")) - nowBet;;
    coinButton.value = '\\' + currentValue;

    if (once == false) { // 一回だけ実行
        once = true;
        spin = false;
        animationL = imageL.animate( // 左リールスピン開始
            [
                { transform: currentPositionL },
                { transform: 'translate(-50%, -80px)' }
            ],
            {
                duration: 250,
                easing: 'linear',
                iterations: Infinity,
            }
        );

        animationC = imageC.animate( // 中リールスピン開始
            [
                { transform: currentPositionC },
                { transform: 'translate(-50%, -80px)' }
            ],
            {
                duration: 250,
                easing: 'linear',
                iterations: Infinity,
            }
        )

        animationR = imageR.animate( // 右リールスピン開始
            [
                { transform: currentPositionR },
                { transform: 'translate(-50%, -80px)' }
            ],
            {
                duration: 250,
                easing: 'linear',
                iterations: Infinity,
            }
        )
    } else if (spin == true) { // スピン開始
        spin = false;
        animationLcorr.cancel(); // 修正解除しなければリール実行できないため
        animationL.play(); // リール実行

        animationCcorr.cancel(); // 修正解除しなければリール実行できないため
        animationC.play(); // リール実行

        animationRcorr.cancel(); // 修正解除しなければリール実行できないため
        animationR.play(); // リール実行
    }
}



function reelLstop() {
    if (stopL == false) {
        const reelLstopSE = document.getElementById("reelLstopSE");
        reelLstopSE.volume = 0.35; // 音量
        reelLstopSE.play();
        setTimeout(function () {
            reelLstopSE.pause(); // 一時停止
            reelLstopSE.currentTime = 0;
        }, 500);

        animationL.pause(); // アニメーション停止
        const stoppedPositionL = getComputedStyle(imageL).transform; // 停止位置を取得
        const translateY = parseFloat(stoppedPositionL.split(", ")[5]); // y方向の平行移動を取得
        console.log("左リールのY軸の位置：", translateY);
        positionCorrectionL(); //リール修正実行
        stopL = true; // ストップLが押された
    }
}

function reelCstop() {
    if (stopC == false) {
        const reelCstopSE = document.getElementById("reelCstopSE");
        reelCstopSE.volume = 0.35; // 音量
        reelCstopSE.play();
        setTimeout(function () {
            reelCstopSE.pause(); // 一時停止
            reelCstopSE.currentTime = 0;
        }, 500);

        animationC.pause();
        const stoppedPositionC = getComputedStyle(imageC).transform; // 停止位置を取得
        const translateY = parseFloat(stoppedPositionC.split(", ")[5]); // y方向の平行移動を取得
        console.log("中リールのY軸の位置：", translateY);
        positionCorrectionC(); //リール修正実行
        stopC = true; // ストップCが押された
    }
}

function reelRstop() {
    if (stopR == false) {
        const reelRstopSE = document.getElementById("reelRstopSE");
        reelRstopSE.volume = 0.35; // 音量
        reelRstopSE.play();
        setTimeout(function () {
            reelRstopSE.pause(); // 一時停止
            reelRstopSE.currentTime = 0;
        }, 500);

        animationR.pause();
        const stoppedPositionR = getComputedStyle(imageR).transform; // 停止位置を取得
        const translateY = parseFloat(stoppedPositionR.split(", ")[5]); // y方向の平行移動を取得
        console.log("右リールのY軸の位置：", translateY);
        positionCorrectionR(); //リール修正実行
        stopR = true; // ストップRが押された
    }
}



// 左リール停止位置修正
function positionCorrectionL() {
    if (stopPCL == false) {
        const imageL = document.getElementById("imageL"); // 画像を取得
        const stoppedPositionL = getComputedStyle(imageL).transform; // 停止位置を取得
        const translateY = parseFloat(stoppedPositionL.split(", ")[5]); // y方向の平行移動を取得
        if (translateY > -108) {         // -80 ~ -136 ブドウ, イチゴ, スイカ
            pCnumL = -80;
        } else if (translateY > -164) { // -136 ~ -192　イチゴ, スイカ, バナナ
            pCnumL = -136;
        } else if (translateY > -220) { // -192 ~ -248 スイカ, バナナ, 7
            pCnumL = -192;
        } else if (translateY > -276) { // -248 ~ -304 バナナ, 7, サクランボ
            pCnumL = -248;
        } else if (translateY > -332) { // -304 ~ -360　7, サクランボ, BAR
            pCnumL = -304;
        } else if (translateY > -388) { // -360 ~ -416 サクランボ, BAR, スモモ
            pCnumL = -360;
        } else if (translateY > -444) { // -416 ~ -472 BAR, スモモ, レモン
            pCnumL = -416;
        } else if (translateY > -500) { // -472 ~ -528 スモモ, レモン, ブドウ
            pCnumL = -472;
        } else if (translateY > -556) { // -528 ~ -584 レモン, ブドウ, イチゴ
            pCnumL = -528;
        } else {                       // -584 ~ -585 ブドウ, イチゴ, スイカ
            pCnumL = -584;
        }
        animationLcorr = imageL.animate(
            [
                { transform: stoppedPositionL },
                { transform: `translate(-50%, ${pCnumL}px)` } // pCnumL の位置まで移動
            ],
            {
                duration: 100,
                easing: 'linear',
                fill: 'forwards', // 'forwards' を文字列として指定
            }
        )
        animationLcorr.onfinish = () => {
            console.log("左リールのY軸の修正：", pCnumL);
            stopPCL = true;
            if (stopPCL == true && stopPCC == true && stopPCR == true) { // 全てのリールの修正が完了したら実行
                reelsResult();
            }
        };
    }
}



// 中リール停止位置修正
function positionCorrectionC() {
    if (stopPCC == false) {
        const imageC = document.getElementById("imageC"); // 画像を取得
        const stoppedPositionC = getComputedStyle(imageC).transform; // 停止位置を取得
        const translateY = parseFloat(stoppedPositionC.split(", ")[5]); // y方向の平行移動を取得
        if (translateY > -108) {         // -80 ~ -136　スイカ, バナナ, サクランボ
            pCnumC = -80;
        } else if (translateY > -164) { // -136 ~ -192 バナナ, サクランボ, イチゴ
            pCnumC = -136;
        } else if (translateY > -220) { // -192 ~ -248 サクランボ, イチゴ, BAR
            pCnumC = -192;
        } else if (translateY > -276) { // -248 ~ -304 イチゴ, BAR, レモン
            pCnumC = -248;
        } else if (translateY > -332) { // -304 ~ -360 BAR, レモン, スモモ
            pCnumC = -304;
        } else if (translateY > -388) { // -360 ~ -416 レモン, スモモ, ブドウ
            pCnumC = -360;
        } else if (translateY > -444) { // -416 ~ -472 スモモ, ブドウ, 7
            pCnumC = -416;
        } else if (translateY > -500) { // -472 ~ -528 ブドウ, 7, スイカ
            pCnumC = -472;
        } else if (translateY > -556) { // -528 ~ -584 7, スイカ, バナナ
            pCnumC = -528;
        } else {                       // -584 ~ -585 スイカ, バナナ, サクランボ
            pCnumC = -584;
        }
        animationCcorr = imageC.animate(
            [
                { transform: stoppedPositionC },
                { transform: `translate(-50%, ${pCnumC}px)` } // pCnumC の位置まで移動
            ],
            {
                duration: 100,
                easing: 'linear',
                fill: 'forwards', // 'forwards' を文字列として指定
            }
        )
        animationCcorr.onfinish = () => {
            console.log("中リールのY軸の修正：", pCnumC);
            stopPCC = true;
            if (stopPCL == true && stopPCC == true && stopPCR == true) { // 全てのリールの修正が完了したら実行
                reelsResult();
            }
        };
    }
}



// 右リール停止位置修正
function positionCorrectionR() {
    if (stopPCR == false) {
        const imageR = document.getElementById("imageR"); // 画像を取得
        const stoppedPositionR = getComputedStyle(imageR).transform; // 停止位置を取得
        const translateY = parseFloat(stoppedPositionR.split(", ")[5]); // y方向の平行移動を取得

        if (translateY > -108) {         // -80 ~ -136 BAR, ブドウ, バナナ
            pCnumR = -80;
        } else if (translateY > -164) { // -136 ~ -192 ブドウ, バナナ, 7
            pCnumR = -136;
        } else if (translateY > -220) { // -192 ~ -248 バナナ, 7, サクランボ
            pCnumR = -192;
        } else if (translateY > -276) { // -248 ~ -304 7, サクランボ, イチゴ
            pCnumR = -248;
        } else if (translateY > -332) { // -304 ~ -360 サクランボ, イチゴ, スモモ
            pCnumR = -304;
        } else if (translateY > -388) { // -360 ~ -416 イチゴ, スモモ, レモン
            pCnumR = -360;
        } else if (translateY > -444) { // -416 ~ -472 スモモ, レモン, スイカ
            pCnumR = -416;
        } else if (translateY > -500) { // -472 ~ -528 レモン, スイカ, BAR
            pCnumR = -472;
        } else if (translateY > -556) { // -528 ~ -584 スイカ, BAR, ブドウ
            pCnumR = -528;
        } else {                       // -584 ~ -585 BAR, ブドウ, バナナ
            pCnumR = -584;
        }
        animationRcorr = imageR.animate(
            [
                { transform: stoppedPositionR },
                { transform: `translate(-50%, ${pCnumR}px)` } // pCnumR の位置まで移動
            ],
            {
                duration: 100,
                easing: 'linear',
                fill: 'forwards', // 'forwards' を文字列として指定
            }
        )
        animationRcorr.onfinish = () => {
            console.log("右リールのY軸の修正：", pCnumR);
            stopPCR = true;
            if (stopPCL == true && stopPCC == true && stopPCR == true) { // 全てのリールの修正が完了したら実行
                reelsResult();
            }
        };
    }
}



// 全てのリール結果
function reelsResult() {
    const bet = document.getElementById("bet"); // 掛け金を表示する要素を取得
    nowBet = parseInt(bet.innerHTML); // 現在の掛け金を取得して整数に変換
    if (nowBet == 1) {                      // 1ベット時
        reelMiddleResult(); // リール中結果
    } else if (nowBet == 2) {               // 2ベット時
        reelTopResult(); // リール上結果
        reelMiddleResult(); // リール中結果
        reelBottomResult(); // リール下結果
    } else if (nowBet == 3) {               // 3ベット時
        reelTopResult(); // リール上結果
        reelMiddleResult(); // リール中結果
        reelBottomResult(); // リール下結果
        reelDiagonalLeftResult(); // リール左斜結果
        reelDiagonalRightResult(); // リール右斜結果
    }

    const coinBtn = document.getElementById("coinBtn");
    const spinBtn = document.getElementById("spinBtn");
    const betPlus = document.getElementById("betPlusBtn"); // 掛け金プラスボタン取得
    const betMinus = document.getElementById("betMinusBtn"); // 掛け金マイナスボタン取得
    spin = true;
    coinBtn.disabled = false; // ボタン有効化
    spinBtn.disabled = false; // ボタン有効化
    betPlus.disabled = false; // ボタン有効化
    betMinus.disabled = false; // ボタン有効化
    rSE.pause(); // リールスピンSE一時停止
    rSEcheck = false;

    // もし掛け金がmax、または所持金が0の場合はdisable
    const coinButton = document.getElementById("coinBtn");
    const currentValue = parseInt(coinButton.value.replace("\\", "")); // 現在の所持金
    nowBet = parseInt(bet.innerHTML); // 現在の掛け金を取得して整数に変換
    if (nowBet == 3) {
        betPlus.disabled = true; // プラスボタンを押せないようにする
    }
    if (currentValue == 0) {
        betPlus.disabled = true; // プラスボタンを押せないようにする
    }
    // もし掛け金が0の場合はdisable
    nowBet = parseInt(bet.innerHTML); // 現在の掛け金を取得して整数に変換
    if (nowBet == 0) {
        betMinus.disabled = true; // マイナスボタンを押せないようにする
    }
}



// リール上段結果
function reelTopResult() {
    if ((pCnumL == -80 || pCnumL == -584) && pCnumC == -472 && pCnumR == -136) {         // ブドウがそろった場合
        console.log("上段ブドウ");
        winMoney = nowBet * 1;
        winResult();
    } else if (pCnumL == -136 && pCnumC == -248 && pCnumR == -360) {                      // イチゴがそろった場合
        console.log("上段イチゴ");
        winMoney = nowBet * 2;
        winResult()
    } else if (pCnumL == -192 && (pCnumC == -80 || pCnumC == -584) && pCnumR == -528) {  // スイカがそろった場合
        console.log("上段スイカ");
        winMoney = nowBet * 3;
        winResult()
    } else if (pCnumL == -248 && pCnumC == -136 && pCnumR == -192) {                      // バナナがそろった場合
        console.log("上段バナナ");
        winMoney = nowBet * 4;
        winResult()
    } else if (pCnumL == -304 && pCnumC == -528 && pCnumR == -248) {                      // 7がそろった場合
        console.log("上段7");
        const sevenSE = document.getElementById("sevenSE");
        sevenSE.volume = 0.1; // 音量
        sevenSE.play(); // 再生
        setTimeout(function () {
            sevenSE.pause(); // 一時停止
            sevenSE.currentTime = 0;
        }, 4100);
        winMoney = nowBet * 50;
        winResult()
    } else if (pCnumL == -360 && pCnumC == -192 && pCnumR == -304) {                      // サクランボがそろった場合
        console.log("上段サクランボ");
        winMoney = nowBet * 5;
        winResult()
    } else if (pCnumL == -416 && pCnumC == -304 && (pCnumR == -80 || pCnumR == -584)) {  // BARがそろった場合
        console.log("上段BAR");
        winMoney = nowBet * 25;
        winResult()
    } else if (pCnumL == -472 && pCnumC == -416 && pCnumR == -416) {                      // スモモがそろった場合
        console.log("上段スモモ");
        winMoney = nowBet * 6;
        winResult()
    } else if (pCnumL == -528 && pCnumC == -360 && pCnumR == -472) {                      // レモンがそろった場合
        console.log("上段レモン");
        winMoney = nowBet * 7;
        winResult()
    } else {
        console.log("上段不揃い");
    }
}

// リール中段結果
function reelMiddleResult() {
    if (pCnumL == -528 && pCnumC == -416 && (pCnumR == -80 || pCnumR == -584)) {         // ブドウがそろった場合
        console.log("中段ブドウ");
        winMoney = nowBet * 1;
        winResult()
    } else if ((pCnumL == -80 || pCnumL == -584) && pCnumC == -192 && pCnumR == -304) {  // イチゴがそろった場合
        console.log("中段イチゴ");
        winMoney = nowBet * 2;
        winResult()
    } else if (pCnumL == -136 && pCnumC == -528 && pCnumR == -472) {                      // スイカがそろった場合
        console.log("中段スイカ");
        winMoney = nowBet * 3;
        winResult()
    } else if (pCnumL == -192 && (pCnumC == -80 || pCnumC == -584) && pCnumR == -136) {  // バナナがそろった場合
        console.log("中段バナナ");
        winMoney = nowBet * 4;
        winResult()
    } else if (pCnumL == -248 && pCnumC == -472 && pCnumR == -192) {                      // 7がそろった場合
        console.log("中段7");
        const sevenSE = document.getElementById("sevenSE");
        sevenSE.volume = 0.1; // 音量
        sevenSE.play(); // 再生
        setTimeout(function () {
            sevenSE.pause(); // 一時停止
            sevenSE.currentTime = 0;
        }, 4100);
        winMoney = nowBet * 50;
        winResult()
    } else if (pCnumL == -304 && pCnumC == -136 && pCnumR == -248) {                      // サクランボがそろった場合
        console.log("中段サクランボ");
        winMoney = nowBet * 5;
        winResult()
    } else if (pCnumL == -360 && pCnumC == -248 && pCnumR == -528) {                      // BARがそろった場合
        console.log("中段BAR");
        winMoney = nowBet * 25;
        winResult()
    } else if (pCnumL == -416 && pCnumC == -360 && pCnumR == -360) {                      // スモモがそろった場合
        console.log("中段スモモ");
        winMoney = nowBet * 6;
        winResult()
    } else if (pCnumL == -472 && pCnumC == -304 && pCnumR == -416) {                      // レモンがそろった場合
        console.log("中段レモン");
        winMoney = nowBet * 7;
        winResult()
    } else {
        console.log("中段不揃い");
    }
}

// リール下段結果
function reelBottomResult() {
    if (pCnumL == -472 && pCnumC == -360 && pCnumR == -528) {                             // ブドウがそろった場合
        console.log("下段ブドウ");
        winMoney = nowBet * 1;
        winResult()
    } else if (pCnumL == -528 && pCnumC == -136 && pCnumR == -248) {                      // イチゴがそろった場合
        console.log("下段イチゴ");
        winMoney = nowBet * 2;
        winResult()
    } else if ((pCnumL == -80 || pCnumL == -584) && pCnumC == -472 && pCnumR == -416) {  // スイカがそろった場合
        console.log("下段スイカ");
        winMoney = nowBet * 3;
        winResult()
    } else if (pCnumL == -136 && pCnumC == -528 && (pCnumR == -80 || pCnumR == -584)) {  // バナナがそろった場合
        console.log("下段バナナ");
        winMoney = nowBet * 4;
        winResult()
    } else if (pCnumL == -192 && pCnumC == -416 && pCnumR == -136) {                      // 7がそろった場合
        console.log("下段7");
        const sevenSE = document.getElementById("sevenSE");
        sevenSE.volume = 0.1; // 音量
        sevenSE.play(); // 再生
        setTimeout(function () {
            sevenSE.pause(); // 一時停止
            sevenSE.currentTime = 0;
        }, 4100);
        winMoney = nowBet * 50;
        winResult()
    } else if (pCnumL == -248 && (pCnumC == -80 || pCnumC == -584) && pCnumR == -192) {  // サクランボがそろった場合
        console.log("下段サクランボ");
        winMoney = nowBet * 5;
        winResult()
    } else if (pCnumL == -304 && pCnumC == -192 && pCnumR == -472) {                      // BARがそろった場合
        console.log("下段BAR");
        winMoney = nowBet * 25;
        winResult()
    } else if (pCnumL == -360 && pCnumC == -304 && pCnumR == -304) {                      // スモモがそろった場合
        console.log("下段スモモ");
        winMoney = nowBet * 6;
        winResult()
    } else if (pCnumL == -416 && pCnumC == -248 && pCnumR == -360) {                      // レモンがそろった場合
        console.log("下段レモン");
        winMoney = nowBet * 7;
        winResult()
    } else {
        console.log("下段不揃い");
    }
}

// リール左斜結果
function reelDiagonalLeftResult() {
    if ((pCnumL == -80 || pCnumL == -584) && pCnumC == -416 && (pCnumR == -80 || pCnumR == -584)) {         // ブドウがそろった場合
        console.log("左斜ブドウ");
        winMoney = nowBet * 1;
        winResult();
    } else if (pCnumL == -136 && pCnumC == -192 && pCnumR == -248) {                                        // イチゴがそろった場合
        console.log("左斜イチゴ");
        winMoney = nowBet * 2;
        winResult()
    } else if (pCnumL == -192 && pCnumC == -528 && pCnumR == -416) {                                        // スイカがそろった場合
        console.log("左斜スイカ");
        winMoney = nowBet * 3;
        winResult()
    } else if (pCnumL == -248 && (pCnumC == -80 || pCnumC == -584) && (pCnumR == -80 || pCnumR == -584)) {  // バナナがそろった場合
        console.log("左斜バナナ");
        winMoney = nowBet * 4;
        winResult()
    } else if (pCnumL == -304 && pCnumC == -472 && pCnumR == -136) {                                        // 7がそろった場合
        console.log("左斜7");
        const sevenSE = document.getElementById("sevenSE");
        sevenSE.volume = 0.1; // 音量
        sevenSE.play(); // 再生
        setTimeout(function () {
            sevenSE.pause(); // 一時停止
            sevenSE.currentTime = 0;
        }, 4100);
        winMoney = nowBet * 50;
        winResult()
    } else if (pCnumL == -360 && pCnumC == -136 && pCnumR == -192) {                                        // サクランボがそろった場合
        console.log("左斜サクランボ");
        winMoney = nowBet * 5;
        winResult()
    } else if (pCnumL == -416 && pCnumC == -248 && pCnumR == -472) {                     // BARがそろった場合
        console.log("左斜BAR");
        winMoney = nowBet * 25;
        winResult()
    } else if (pCnumL == -472 && pCnumC == -360 && pCnumR == -304) {                                        // スモモがそろった場合
        console.log("左斜スモモ");
        winMoney = nowBet * 6;
        winResult()
    } else if (pCnumL == -528 && pCnumC == -304 && pCnumR == -360) {                                        // レモンがそろった場合
        console.log("左斜レモン");
        winMoney = nowBet * 7;
        winResult()
    } else {
        console.log("左斜不揃い");
    }
}

// リール右斜結果
function reelDiagonalRightResult() {
    if (pCnumL == -472 && pCnumC == -416 && pCnumR == -136) {                                               // ブドウがそろった場合
        console.log("右斜ブドウ");
        winMoney = nowBet * 1;
        winResult()
    } else if (pCnumL == -528 && pCnumC == -192 && pCnumR == -360) {                                        // イチゴがそろった場合
        console.log("右斜イチゴ");
        winMoney = nowBet * 2;
        winResult()
    } else if ((pCnumL == -80 || pCnumL == -584) && pCnumC == -528 && pCnumR == -528) {                     // スイカがそろった場合
        console.log("右斜スイカ");
        winMoney = nowBet * 3;
        winResult()
    } else if (pCnumL == -136 && (pCnumC == -80 || pCnumC == -584) && pCnumR == -192) {                     // バナナがそろった場合
        console.log("右斜バナナ");
        winMoney = nowBet * 4;
        winResult()
    } else if (pCnumL == -192 && pCnumC == -472 && pCnumR == -248) {                                        // 7がそろった場合
        console.log("右斜7");
        const sevenSE = document.getElementById("sevenSE");
        sevenSE.volume = 0.1; // 音量
        sevenSE.play(); // 再生
        setTimeout(function () {
            sevenSE.pause(); // 一時停止
            sevenSE.currentTime = 0;
        }, 4100);
        winMoney = nowBet * 50;
        winResult()
    } else if (pCnumL == -248 && pCnumC == -136 && pCnumR == -304) {                                        // サクランボがそろった場合
        console.log("右斜サクランボ");
        winMoney = nowBet * 5;
        winResult()
    } else if (pCnumL == -304 && pCnumC == -248 && (pCnumR == -80 || pCnumR == -584)) {                     // BARがそろった場合
        console.log("右斜BAR");
        winMoney = nowBet * 25;
        winResult()
    } else if (pCnumL == -360 && pCnumC == -360 && pCnumR == -416) {                                        // スモモがそろった場合
        console.log("右斜スモモ");
        winMoney = nowBet * 6;
        winResult()
    } else if (pCnumL == -416 && pCnumC == -304 && pCnumR == -472) {                                        // レモンがそろった場合
        console.log("右斜レモン");
        winMoney = nowBet * 7;
        winResult()
    } else {
        console.log("右斜不揃い");
    }
}



function winResult() {
    const nowWin = document.getElementById("nowWin");
    const totalWin = document.getElementById("totalWin");
    nowWin.innerHTML = winMoney;
    totalWin.innerHTML = parseInt(totalWin.innerHTML) + parseInt(winMoney);

    // 所持金を増やす
    const coinButton = document.getElementById("coinBtn");
    const currentValue = parseInt(coinButton.value.replace("\\", "")) + winMoney;;
    coinButton.value = '\\' + currentValue;
}



// BETボタン
function updateBet(valueChange) {
    const bet = document.getElementById("bet"); // 掛け金を表示する要素を取得
    nowBet = parseInt(bet.innerHTML); // 現在の掛け金を取得して整数に変換

    // 値の増減を反映
    nowBet += valueChange;

    // テキストコンテンツを更新
    bet.innerHTML = `${nowBet}`;
}

function betPlus() {
    const bet = document.getElementById("bet"); // 掛け金を表示する要素を取得
    const betPlus = document.getElementById("betPlusBtn");
    const betMinus = document.getElementById("betMinusBtn");
    const coinButton = document.getElementById("coinBtn");
    const currentValue = parseInt(coinButton.value.replace("\\", "")); // 現在の所持金
    nowBet = parseInt(bet.innerHTML); // 現在の掛け金を取得して整数に変換
    if (nowBet == 0 && currentValue >= 1) {
        updateBet(1); // 掛け金を1増やす
        betMinus.disabled = false; // マイナスボタンを押せるようにする
    } else if (nowBet == 1 && currentValue >= 2) {
        updateBet(1); // 掛け金を1増やす
        betMinus.disabled = false; // マイナスボタンを押せるようにする
    } else if (nowBet == 2 && currentValue >= 3) {
        updateBet(1); // 掛け金を1増やす
        betMinus.disabled = false; // マイナスボタンを押せるようにする
    }
    if (nowBet == 3) {
        betPlus.disabled = true; // プラスボタンを押せないようにする
    }
    if (currentValue == 0) {
        betPlus.disabled = true; // プラスボタンを押せないようにする
    }
}

function betMinus() {
    const bet = document.getElementById("bet"); // 掛け金を表示する要素を取得
    const betPlus = document.getElementById("betPlusBtn");
    const betMinus = document.getElementById("betMinusBtn");
    const coinButton = document.getElementById("coinBtn");
    const currentValue = parseInt(coinButton.value.replace("\\", "")); // 現在の所持金
    nowBet = parseInt(bet.innerHTML); // 現在の掛け金を取得して整数に変換
    if ((nowBet >= 1 || nowBet <= 3) && currentValue >= 1) {
        updateBet(-1); // 掛け金を1減らす
        betPlus.disabled = false; // プラスボタンを押せるようにする
    }
    if (nowBet == 0) {
        betMinus.disabled = true; // マイナスボタンを押せないようにする
    }
}



function soundEffect(name) {
    if (name == coinBtnSE) {
        const moneyMenuBtn = document.getElementById("moneyMenuBtn");
        const cbSE = document.getElementById("coinBtnSE");
        if (!moneyMenuBtn.classList.contains("active")) {
            // active クラスが付与されていない場合の処理
            cbSE.volume = 0.1; // 音量
            cbSE.play();
            setTimeout(function () {
                cbSE.pause(); // 一時停止
                cbSE.currentTime = 0;
            }, 500);
        }
    } else if (name == infoBtnSE) {
        const infoMenuBtn = document.getElementById("infoMenuBtn");
        const ibSE = document.getElementById("infoBtnSE");
        if (!infoMenuBtn.classList.contains("active")) {
            // active クラスが付与されていない場合の処理
            ibSE.volume = 0.1; // 音量
            ibSE.play();
            setTimeout(function () {
                ibSE.pause(); // 一時停止
                ibSE.currentTime = 0;
            }, 500);
        }
    } else if (name == betPlusBtnSE) {
        const bpbSE = document.getElementById("betPlusBtnSE");
        bpbSE.volume = 0.1; // 音量
        bpbSE.play();
        setTimeout(function () {
            bpbSE.pause(); // 一時停止
            bpbSE.currentTime = 0;
        }, 100);
    } else if (name == betMinusBtnSE) {
        const bmbSE = document.getElementById("betMinusBtnSE");
        bmbSE.volume = 0.1; // 音量
        bmbSE.play();
        setTimeout(function () {
            bmbSE.pause(); // 一時停止
            bmbSE.currentTime = 0;
        }, 100);
    } else if (name == spinBtnSE) {
        const sbSE = document.getElementById("spinBtnSE");
        sbSE.volume = 0.1; // 音量
        sbSE.play(); // 再生
        setTimeout(function () {
            sbSE.pause(); // 一時停止
            sbSE.currentTime = 0;
        }, 500);

        // リールスピン音ループ
        rSE = document.getElementById("reelSE");
        rSEcheck = true; // 無限ループしないように
        const loopPlay = function () {
            if (rSEcheck == true) {
                rSE.volume = 0.1; // 音量
                rSE.play(); // 再生
                rSE.currentTime = 0;
                setTimeout(loopPlay, 3100); // ループ時間
            } else {
                rSE.pause();
                rSE.currentTime = 0;
            };
        }
        loopPlay();
    }
}



function bgm() {
    const bgm = document.getElementById("bgm");
    const soundIcon = document.getElementById('soundIcon');
    if (bgmcheck == false) {
        bgm.volume = 0.1; // 音量
        bgm.play();
        soundIcon.src = './images/可愛いスピーカーアイコン.png';
        bgmcheck = true;
    } else {
        bgm.pause();
        bgm.currentTime = 0;
        soundIcon.src = './images/スピーカーOFFアイコン.png';
        bgmcheck = false;
    }
}
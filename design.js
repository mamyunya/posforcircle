//トグルの設定
function createQuantitySelect() {
    const select = document.createElement('select');
    for (let i = 0; i <= 10; i++) {  // 数量1〜10を選択可能
        const option = document.createElement('option');
        option.value = i;
        option.innerText = i;
        select.appendChild(option);
    }
    return select;
}


//キーボード確定ボタン押下時、次の画面に進む
document.addEventListener('keydown', (event) => {
    var keyName = event.key;
    console.log(keyName);
    if(keyName == 'Enter'){
        if(document.activeElement.id == 'paymentInput'){
            calculateChange();
            document.activeElement.blur()
        }else if(document.activeElement.id == 'Information'){
            addInformation();
        }
    }
});


// 東京のタイムゾーンで日付と時間を取得（YYYY-MM-DDTHH:mm:ss形式）
const dateTimeFormat = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo', 
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });


const LONG_PRESS_THRESHOLD = 100; // ミリ秒

/**
 * 個々の商品のカウンターUI要素を作成し、返します。
 * イベントリスナーはここで設定しますが、実際のカウントロジックは外部から提供されます。
 * @param {number} initialCount - カウンターの初期値
 * @param {Function} onIncrement - インクリメントボタンがクリックされたときに呼び出すコールバック
 * @param {Function} onReset - リセットボタンが長押しされたときに呼び出すコールバック
 * @returns {Object} { container: HTMLElement, display: HTMLElement, incrementBtn: HTMLElement, resetBtn: HTMLElement }
 */
function createCounterUI(initialCount, onIncrement, onReset) {
    const itemCounterContainer = document.createElement('div');
    itemCounterContainer.classList.add('item-counter-container');

    const counterDisplay = document.createElement('div');
    counterDisplay.classList.add('item-counter-display');
    counterDisplay.textContent = initialCount;

    const incrementButton = document.createElement('button');
    incrementButton.classList.add('item-counter-button');
    incrementButton.textContent = '追加';

    const decrementButton = document.createElement('button');
    decrementButton.classList.add('item-counter-button', 'item-reset-button');
    decrementButton.textContent = '戻す';

    itemCounterContainer.appendChild(counterDisplay);
    itemCounterContainer.appendChild(incrementButton);
    itemCounterContainer.appendChild(decrementButton);

    // イベントリスナーの設定
    incrementButton.addEventListener('click', onIncrement);

    let longPressTimer;

    // リセットボタンのmousedown/touchstartイベント
    const startPress = (e) => {
        e.preventDefault(); // デフォルトのタッチ動作（スクロールなど）を防ぐ
        longPressTimer = setTimeout(() => {
            onReset(); // 長押しが検出されたらリセットコールバックを呼び出す
            counterDisplay.classList.add('reset-animation');
            counterDisplay.addEventListener('animationend', () => {
                counterDisplay.classList.remove('reset-animation');
            }, { once: true });
        }, LONG_PRESS_THRESHOLD);
    };

    const endPress = () => {
        clearTimeout(longPressTimer);
    };

    decrementButton.addEventListener('mousedown', startPress);
    decrementButton.addEventListener('mouseup', endPress);
    decrementButton.addEventListener('mouseleave', endPress);

    decrementButton.addEventListener('touchstart', startPress, { passive: false });
    decrementButton.addEventListener('touchend', endPress);
    decrementButton.addEventListener('touchcancel', endPress);

    return {
        container: itemCounterContainer,
        display: counterDisplay,
        incrementBtn: incrementButton,
        resetBtn: decrementButton
    };
}

/**
 * カウンターの表示を更新します。
 * @param {HTMLElement} displayElement - カウンターの数字が表示されるDOM要素
 * @param {number} newCount - 新しいカウント値
 */
function updateCounterDisplay(displayElement, newCount) {
    displayElement.textContent = newCount;
}

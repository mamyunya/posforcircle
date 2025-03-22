let totalAmount = 0; // 小計金額を保存
let selectedProducts = [];//購入商品リスト


// ページ遷移を管理
function navigate(pageId, element) {
    console.log(element);
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(pageId + 'Page');
    targetPage.classList.add('active');
    daletePaymentValue();


    // すべてのタブのアクティブクラスを削除

    document.querySelectorAll('.navbar a').forEach(tab => {
        tab.classList.remove('active');
    });

    if(targetPage==homePage){
        selectedProducts = [];
        showProduct();
        element.classList.add('active');
    }else if(targetPage==salesPage){
        showSales();
        element.classList.add('active');
    }else if(targetPage==registerPage){
       ShowRegisteredProducts();
       element.classList.add('active');
    }
}


//購入処理
function processPurchase() {
    
    // 商品リストを取得
    document.querySelectorAll('.product-item').forEach(productDiv => {
        const name = productDiv.getAttribute('data-name');
        const price = parseInt(productDiv.getAttribute('data-price'));
        const quantity = parseInt(productDiv.querySelector('select').value);

        if (quantity > 0) {
            selectedProducts.push({ name, price, quantity });
        }
    });

    if (selectedProducts.length === 0) {
        alert("商品が選択されていません。");
        return;
    }

    // 合計金額を計算
    totalAmount = selectedProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    // 画面遷移 & 合計金額を表示
    navigate('payment', document.getElementById('paymentPage'));
    document.getElementById('totalAmountText').textContent = `合計金額: ¥${totalAmount}`;
}


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

function calculateChange() {
    
    let payment = parseInt(document.getElementById('paymentInput').value, 10);

    if (isNaN(payment) || payment < totalAmount) {
        document.getElementById('changeText').textContent = "支払金額が不足しています。";
        return;
    }

    let change = payment - totalAmount;
    document.getElementById('changeText').textContent = `おつり: ¥${change}`;

    document.getElementById('payment_window1').style.display = 'none';
    document.getElementById('payment_window2').style.display = 'inline';

    // 購入後、選択状態をリセット
    document.querySelectorAll('.product-item select').forEach(select => {
        select.value = "0";
    });
}


function addInformation(){
    let selectedGender,selectedClassfy;
    if(document.querySelector('input[name="gender"]:checked')){
        selectedGender = document.querySelector('input[name="gender"]:checked').value;//性別取得
    }else{
        selectedGender = null;
    }

    if(document.querySelector('input[name="gender"]:checked')){
        selectedClassfy = document.querySelector('input[name="classification"]:checked').value;//区分取得
    }else{
        selectedClassfy = null;
    }

    const information = document.getElementById('Information').value;//番号等取得
    // 購入処理を実行（売上データを保存）

    const selectedInformation = ({ gender:selectedGender, classfy:selectedClassfy, Information:information });
    console.log(selectedProducts);
    console.log(selectedInformation);
    saveSale(selectedInformation);
    daletePaymentValue();
    // ホーム画面に戻る
    navigate('home',document.getElementById('nav_home'));
}


// 支払い画面の入力をリセット
function daletePaymentValue(){
    document.getElementById('paymentInput').value = '';
    document.getElementById('totalAmountText').textContent = '合計金額: ¥0';
    document.getElementById('changeText').textContent = '';
    document.getElementById('Information').value = '';
    document.getElementById('GetInformation').reset();
    document.getElementById('payment_window1').style.display = 'inline';
    document.getElementById('payment_window2').style.display = 'none';
    //document.querySelector('input[name="gender"]:checked').value = '';
    //document.querySelector('input[name="classification"]:checked').value = '';
}


//売上データの保存
function saveSale(selectedInformation) {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];

    // 日付を取得（YYYY-MM-DD 形式）
    const today = dateTimeFormat.format(new Date());

    // 合計金額を計算
    let totalAmount = 0;
    const items = selectedProducts.map(product => {
        totalAmount += product.price * product.quantity;
        return { name: product.name, quantity: product.quantity };
    });

    // 売上データを追加
    const newSale = {
        date: today,
        items: items,
        gender: selectedInformation.gender,
        classfy: selectedInformation.classfy,
        Information: selectedInformation.Information,
        total: totalAmount
    };

    sales.push(newSale);
    localStorage.setItem('sales', JSON.stringify(sales));
}


//売上データを表示
function showSales() {
    const salesList = JSON.parse(localStorage.getItem('sales')) || [];
    const salesContainer = document.getElementById('salesList');
    salesContainer.innerHTML = ''; // クリア
    if (salesList.length === 0) {
        console.log("showing data was blocked");
        return;
    }
    // 商品名のリストを取得（重複なし）
    let allProductNames = new Set();
    salesList.forEach(sale => {
        sale.items.forEach(item => allProductNames.add(item.name));
    });

    allProductNames = Array.from(allProductNames); // Set → Array に変換

    // テーブルのヘッダーを作成
    let headerRow = `<tr><th>NO.</th><th>日時</th>`;
    allProductNames.forEach(name => headerRow += `<th>${name}</th>`);
    headerRow += `<th>性別</th>`;
    headerRow += `<th>区分</th>`;
    headerRow += `<th>その他</th>`;
    headerRow += `<th>小計</th></tr>`;

    salesContainer.innerHTML = headerRow; // ヘッダー追加

    // 売上データを行ごとに追加
    salesList.forEach((sale, index) => {
        let row = `<tr><td>${index + 1}</td><td>${sale.date}</td>`;

        // 商品ごとの数量をオブジェクトに変換 例:{ "コーヒー": 2, "ケーキ": 1 }
        let itemMap = {};
        sale.items.forEach(item => {
            itemMap[item.name] = item.quantity;
        });

        // 全商品リストにあるものを順番に取得（無いものは空欄）
        allProductNames.forEach(name => {
            row += `<td>${itemMap[name] || ''}</td>`;
        });

        row += `<td>${sale.gender}</td>`;
        row += `<td>${sale.classfy}</td>`;
        row += `<td>${sale.Information}</td>`;

        row += `<td>¥${sale.total}</td></tr>`;
        salesContainer.innerHTML += row;
    });
}


//売上データ削除
function deleteSalesList(){
    const confirmDelete = confirm(`売り上げ履歴を削除しますか？\n現在保存されているデータは復元できなくなります`);
    if (!confirmDelete) {
        return; // キャンセルされた場合は削除しない
    }
    localStorage.removeItem('sales');
    showSales();
}


//CSV download
function downloadCSV() {
    const salesList = JSON.parse(localStorage.getItem('sales')) || [];

    if (salesList.length === 0) {
        alert("売上データがありません。");
        return;
    }

    // 商品名のリストを取得（重複なし）
    let allProductNames = new Set();
    salesList.forEach(sale => {
        sale.items.forEach(item => allProductNames.add(item.name));
    });

    allProductNames = Array.from(allProductNames); // Set → Array に変換

    // CSVのヘッダーを作成
    let csvContent = `NO.,日時,${allProductNames.join(',')},性別,区分,付属情報,小計\n`;

    // 売上データをCSVに変換
    salesList.forEach((sale, index) => {
        let row = [`${index + 1}`, sale.date];

        // 商品ごとの数量をオブジェクトに変換 { "コーヒー": 2, "ケーキ": 1 }
        let itemMap = {};
        sale.items.forEach(item => {
            itemMap[item.name] = item.quantity;
        });

        // 全商品リストにあるものを順番に取得（無いものは空欄）
        allProductNames.forEach(name => {
            row.push(itemMap[name] || '');
        });

        row.push(sale.gender || '');// 性別
        row.push(sale.classfy || '');// 区分
        row.push(sale.Information || '');//追加情報

        row.push(sale.total); // 小計を追加
        csvContent += row.join(',') + '\n';
    });

    // CSVデータをBlobに変換
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // ダウンロード用のリンクを作成
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}



// 商品登録フォームを送信したときの処理
document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('productName').value;
    const price = parseInt(document.getElementById('productPrice').value, 10);
    
    if (name && price) {
        const newProduct = { name, price };
        saveProduct(newProduct);
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';
    }
});


// 商品データをローカルストレージに保存
function saveProduct(product) {
    const productList = JSON.parse(localStorage.getItem('productList')) || [];
    productList.push(product);
    localStorage.setItem('productList', JSON.stringify(productList));
}


//商品データを表示
function showProduct(){
    const productList = JSON.parse(localStorage.getItem('productList')) || [];
    const productListContainer = document.getElementById('productList');
    productListContainer.innerHTML = '';  // 表示をリセット

    productList.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');
        productDiv.setAttribute('data-name', product.name);
        productDiv.setAttribute('data-price', product.price);

        // 数量選択ドロップダウンを作成
        const quantitySelect = document.createElement('select');
        for (let i = 0; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            quantitySelect.appendChild(option);
        }

        productDiv.innerHTML = `<span>${product.name} (¥${product.price})</span>`;
        productDiv.appendChild(quantitySelect);
        productListContainer.appendChild(productDiv);
    });
}



function ShowRegisteredProducts() {
    const productList = JSON.parse(localStorage.getItem('productList')) || [];
    const productListContainer = document.getElementById('registeredProducts');
    console.log(productListContainer);
    productListContainer.innerHTML = '';  // 表示をリセット
    

    productList.forEach((product, index) => {
        const productDiv = document.createElement('div');
        const deleteButton = document.createElement('button');

        productDiv.innerHTML = `<span>${product.name} (¥${product.price})</span>`;

        // 削除ボタンの設定
        deleteButton.innerText = '削除';
        deleteButton.onclick = () => deleteProduct(index);

        productDiv.appendChild(deleteButton);  // 削除ボタンを追加
        productDiv.setAttribute('data-index', index);

        productListContainer.appendChild(productDiv);  // `productDiv` を追加
    });
}


function deleteProduct(index) {
    let productList = JSON.parse(localStorage.getItem('productList')) || [];
    //削除再確認
    const confirmDelete = confirm(`「${productList[index].name} (¥${productList[index].price})」を削除しますか？\n現在保存されているデータが破損する恐れがあります。`);
    if (!confirmDelete) {
        return; // キャンセルされた場合は削除しない
    }
    productList.splice(index, 1);  // 指定したインデックスの商品を削除
    console.log(productList);
    localStorage.setItem('productList', JSON.stringify(productList));

    ShowRegisteredProducts();  // 削除後にリストを再描画
}


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


showProduct();
console.log("app start");
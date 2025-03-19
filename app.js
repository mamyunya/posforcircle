// ページ遷移を管理
function navigate(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(pageId + 'Page');
    targetPage.classList.add('active');

    if(targetPage==homePage){
        showProduct();
    }
    if(targetPage==salesPage){
        showSales();
    }
    if(targetPage==registerPage){
       ShowRegisteredProducts();
    }
}


//購入処理
function processPurchase() {
    const selectedProducts = [];

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

    // 購入処理を実行（売上データを保存）
    saveSale(selectedProducts);

    // 成功メッセージ
    alert("購入が完了しました！");

    // 購入後、選択状態をリセット
    document.querySelectorAll('.product-item select').forEach(select => {
        select.value = "0";
    });
}



//売上データの保存
function saveSale(selectedProducts) {
    const sales = JSON.parse(localStorage.getItem('sales')) || [];

    // 日付を取得（YYYY-MM-DD 形式）
    const today = new Date().toISOString().split('T')[0];

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
    let csvContent = `NO.,日時,${allProductNames.join(',')},小計\n`;

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
    remakedata();

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

showProduct();
console.log("app start");
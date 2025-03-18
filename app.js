// ページ遷移を管理
function navigate(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(pageId + 'Page');
    targetPage.classList.add('active');

    if(targetPage==homePage){
        showProduct();
    }
    if(targetPage==registerPage){
       ShowRegisteredProducts();
    }
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

    productList.forEach((product, index) => {
        const productDiv = document.createElement('div');
        const quantitySelect = createQuantitySelect();
        const deleteButton = document.createElement('button');

        productDiv.innerHTML = `
            <span>${product.name} (¥${product.price})</span>
        `;
        productDiv.appendChild(quantitySelect);
        productDiv.setAttribute('data-index', index);
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
class Product {
  constructor(id, name, price, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.quantity = 0;
  }
}

class Cart {
  constructor() {
    this.items = {};
  }

  addToCart(product, quantity) {
    if (quantity > 0) {
      if (this.items[product.id]) {
        this.items[product.id].quantity += quantity;
      } else {
        this.items[product.id] = { product: product, quantity: quantity };
      }
    } else {
      // Jika quantity kurang dari atau sama dengan 0, berikan pesan error atau lakukan tindakan lain sesuai kebutuhan.
      console.log(
        "Quantity harus lebih besar dari 0 untuk menambahkan produk ke keranjang."
      );
    }
  }

  updateCartItemQuantity(productId, newQuantity) {
    if (this.items[productId]) {
      this.items[productId].quantity = newQuantity;
    }
  }

  deleteCartItem(productId) {
    if (this.items[productId]) {
      delete this.items[productId];
    }
  }

  getTotal() {
    let total = 0;
    for (const productId in this.items) {
      if (this.items.hasOwnProperty(productId)) {
        const cartItem = this.items[productId];
        total += cartItem.product.price * cartItem.quantity;
      }
    }
    return total;
  }

  getCartItemCount() {
    let count = 0;
    for (const productId in this.items) {
      if (this.items.hasOwnProperty(productId)) {
        count += this.items[productId].quantity;
      }
    }
    return count;
  }
}

/* Event Listener pada event DOMContentLoaded */
document.addEventListener("DOMContentLoaded", function () {
  const productContainer = document.getElementById("product-list");
  const cartItemsList = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const bayarPajak = document.getElementById("pajak");
  const pembayaranTotal = document.getElementById("bayar-total");
  const totalKeranjang = document.getElementById("cart-info");
  const pajak = 0.11;

  /* inisialisasi daftar produk yang akan ditampilkan di halaman web */
  const products = [
    new Product(1, "ASUS Zenbook", 8000000, "img/laptop1.png"),
    new Product(2, "Lenovo Yoga", 7000000, "img/laptop2.png"),
    new Product(3, "Acer Predator", 12000000, "img/laptop3.png"),
    new Product(4, "Dell Inspiron", 6000000, "img/laptop4.png"),
    new Product(5, "Asus ROG", 7000000, "img/laptop5.png"),
    new Product(6, "Lenovo Ideapad", 5000000, "img/laptop6.png"),
    new Product(7, "ASUS A455LA", 5000000, "img/laptop7.png"),
    new Product(8, "Dell XPS", 7000000, "img/laptop8.png"),
    new Product(9, "ASUS A456UQ", 9000000, "img/laptop9.png"),
  ];

  const cart = new Cart();

  /* Membuat tampilan setiap produk */
  function createProductCard(product) {
    const productCard = document.createElement("article");
    productCard.className = "col-md-4 product-card";

    const productDetails = document.createElement("div");
    productDetails.className = "product-details";

    const productImage = document.createElement("img");
    productImage.className = "product-image";
    productImage.src = product.image;
    productImage.alt = product.name;
    productDetails.appendChild(productImage);

    const productName = document.createElement("h2");
    productName.className = "product-name";
    productName.textContent = product.name;
    productDetails.appendChild(productName);

    const productPrice = document.createElement("p");
    productPrice.className = "product-price";
    productPrice.textContent = `Price: ${formatCurrency(product.price)}`;
    productDetails.appendChild(productPrice);

    const productActions = document.createElement("div");
    productActions.className = "product-actions";

    const decreaseButton = document.createElement("button");
    decreaseButton.className = "btn btn-link decrease-button";
    decreaseButton.innerHTML = '<i class="bi bi-dash-circle-fill"></i>';
    productActions.appendChild(decreaseButton);

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.className = "quantity-input";
    quantityInput.readOnly = true;
    quantityInput.value = 0;
    productActions.appendChild(quantityInput);

    const increaseButton = document.createElement("button");
    increaseButton.className = "btn btn-link increase-button";
    increaseButton.innerHTML = '<i class="bi bi-plus-circle-fill"></i>';
    productActions.appendChild(increaseButton);

    const addButton = document.createElement("button");
    addButton.textContent = "Add to Cart";
    addButton.className = "btn add-button btn-blue";

    /* EventListener pada button decrease */
    decreaseButton.addEventListener("click", function () {
      if (quantityInput.value > 0) {
        quantityInput.value--;
      }
    });

    /* EventListener pada button increase */
    increaseButton.addEventListener("click", function () {
      quantityInput.value++;
    });

    /* EventListener pada button add to cart*/
    addButton.addEventListener("click", function () {
      const selectedQuantity = parseInt(quantityInput.value);
      cart.addToCart(product, selectedQuantity);
      quantityInput.value = 0;
      updateCartItems();
      updateCartCount();
      updateElementsVisibility();
    });

    productDetails.appendChild(productActions);
    productDetails.appendChild(addButton);
    productCard.appendChild(productDetails);

    return productCard;
  }

  /* Pengulangan untuk menampilkan semua produk */
  products.forEach((product, index) => {
    const productCard = createProductCard(product);
    productCard.style.animationDelay = `${index * 500}ms`;
    productContainer.appendChild(productCard);
  });

  const checkoutButton = document.getElementById("checkout-button");

  /* EventListener pada button check out 
       Pembuatan Pop Up untuk menampilkan Struk Pembayaran
    */
  checkoutButton.addEventListener("click", function () {
    const checkoutPopup = document.createElement("div");
    checkoutPopup.className = "checkout-popup";

    const receiptHeader = document.createElement("div");
    receiptHeader.className = "receipt-header";
    const currentDate = new Date();
    receiptHeader.innerHTML = `<h2>Digital Shopping</h2><p>Date: ${currentDate.toLocaleDateString()}</p>`;
    checkoutPopup.appendChild(receiptHeader);

    let totalCheckout = 0;

    for (const productId in cart.items) {
      if (cart.items.hasOwnProperty(productId)) {
        const cartItem = cart.items[productId];

        const popupItemContainer = document.createElement("div");
        popupItemContainer.className = "popup-item-container";

        const popupItemDetails = document.createElement("div");
        popupItemDetails.className = "popup-item-details";

        const productName = document.createElement("h4");
        productName.textContent = cartItem.product.name;
        popupItemDetails.appendChild(productName);

        const productQuantity = document.createElement("p");
        productQuantity.textContent = `Quantity: ` + cartItem.quantity;
        popupItemDetails.appendChild(productQuantity);

        const productSubtotal = document.createElement("p");
        const itemTotal = cartItem.product.price * cartItem.quantity;
        productSubtotal.textContent = `Subtotal: ` + formatCurrency(itemTotal);

        popupItemDetails.appendChild(productSubtotal);

        totalCheckout += itemTotal;

        popupItemContainer.appendChild(popupItemDetails);
        checkoutPopup.appendChild(popupItemContainer);
      }
    }

    const popupTotal = document.createElement("p");
    popupTotal.className = "popup-total";
    popupTotal.textContent = `Total: ` + formatCurrency(totalCheckout);
    checkoutPopup.appendChild(popupTotal);

    const strukPajak = document.createElement("p");
    strukPajak.textContent =
      `Tax (11%): ` + formatCurrency(totalCheckout * 0.11);
    checkoutPopup.appendChild(strukPajak);

    const strukTotalBayar = document.createElement("p");
    strukTotalBayar.className = "popup-total";
    strukTotalBayar.textContent =
      `Total Payment: ` + formatCurrency(totalCheckout + totalCheckout * 0.11);
    checkoutPopup.appendChild(strukTotalBayar);

    const confirmButton = document.createElement("button");
    confirmButton.textContent = "OK";
    confirmButton.className = "btn btn-success confirm-button";

    /* EventListener pada button confirm button */
    confirmButton.addEventListener("click", function () {
      cart.items = {};
      updateCartCount();
      updateCartItems();
      updateElementsVisibility();
      document.body.removeChild(popupOverlay);

      // Tampilkan pop-up terima kasih
      const thankOverlay = document.createElement("div");
      thankOverlay.className = "overlay";
      const thankYouPopup = document.createElement("div");
      thankYouPopup.className = "thank-you-popup";
      thankYouPopup.textContent = "Thank You For Shopping";
      thankOverlay.appendChild(thankYouPopup);
      document.body.appendChild(thankOverlay);

      // Hapus pop-up terima kasih setelah 5 detik
      setTimeout(function () {
        document.body.removeChild(thankOverlay);
      }, 3000); // 5000 ms = 5 detik
    });

    checkoutPopup.appendChild(confirmButton);

    const popupOverlay = document.createElement("div");
    popupOverlay.className = "popup-overlay";
    popupOverlay.appendChild(checkoutPopup);
    document.body.appendChild(popupOverlay);
  });

  /* Fungsi untuk mengatur tampilan button pada keranjang */
  function updateElementsVisibility() {
    const hasItems = cart.getCartItemCount() > 0;

    checkoutButton.style.display = hasItems ? "flex" : "none";
    totalKeranjang.style.display = hasItems ? "flex" : "none";
  }

  updateElementsVisibility();

  /* fungsi untuk mengupdate item keranjang */
  function updateCartItems() {
    cartItemsList.innerHTML = "";
    let total = 0;

    for (const productId in cart.items) {
      if (cart.items.hasOwnProperty(productId)) {
        const cartItem = cart.items[productId];
        const itemTotal = cartItem.product.price * cartItem.quantity;
        total += itemTotal;

        const cartItemContainer = document.createElement("div");
        cartItemContainer.className = "cart-item-container";

        const cartItemImage = document.createElement("img");
        cartItemImage.src = cartItem.product.image;
        cartItemImage.alt = cartItem.product.name;
        cartItemImage.className = "cart-item-image";
        cartItemContainer.appendChild(cartItemImage);

        const cartItemDetails = document.createElement("div");
        cartItemDetails.className = "cart-item-details";

        const productName = document.createElement("h4");
        productName.textContent = cartItem.product.name;
        cartItemDetails.appendChild(productName);

        const productPrice = document.createElement("p");
        productPrice.textContent =
          `Price: ` + formatCurrency(cartItem.product.price);
        cartItemDetails.appendChild(productPrice);

        const productQuantity = document.createElement("p");
        productQuantity.textContent = `Quantity: ` + cartItem.quantity;
        cartItemDetails.appendChild(productQuantity);

        const productSubtotal = document.createElement("p");
        productSubtotal.className = "product-subtotal";
        productSubtotal.textContent =
          "Subtotal:\t\t" + formatCurrency(itemTotal);

        cartItemDetails.appendChild(productSubtotal);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-danger delete-button";
        deleteButton.addEventListener("click", function () {
          deleteCartItem(productId);
        });
        cartItemDetails.appendChild(deleteButton);

        cartItemContainer.appendChild(cartItemDetails);
        cartItemsList.appendChild(cartItemContainer);
      }
    }
    bayarPajak.textContent = formatCurrency(total * pajak);
    cartTotal.textContent = formatCurrency(total);
    pembayaranTotal.textContent = formatCurrency(total + total * pajak);
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  }

  function deleteCartItem(productId) {
    const confirmationPopup = document.getElementById("confirmation-popup");
    const confirmDeleteButton = document.getElementById(
      "confirm-delete-button"
    );
    const cancelDeleteButton = document.getElementById("cancel-delete-button");

    confirmationPopup.style.display = "flex";

    confirmDeleteButton.addEventListener("click", function () {
      cart.deleteCartItem(productId);
      updateCartItems();
      updateCartCount();
      confirmationPopup.style.display = "none";
      updateElementsVisibility();
    });

    cancelDeleteButton.addEventListener("click", function () {
      confirmationPopup.style.display = "none";
    });
  }

  function updateCartCount() {
    let count = cart.getCartItemCount();
    document.getElementById("cart-count").textContent = count.toString();
  }

  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  /* EventListener untuk search button */
  searchButton.addEventListener("click", function (event) {
    event.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();
    const searchResults = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
    displaySearchResults(searchResults);
  });

  function displaySearchResults(results) {
    productContainer.innerHTML = "";
    if (results.length === 0) {
      const noResultsMessage = document.createElement("p");
      noResultsMessage.textContent = "Product not found.";
      productContainer.appendChild(noResultsMessage);
    } else {
      results.forEach((product) => {
        const productCard = createProductCard(product);
        productContainer.appendChild(productCard);
      });
    }
  }

  updateCartItems();
});

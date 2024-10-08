document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartCount();

    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", () => {
        const name = button.getAttribute("data-name");
        const price = parseFloat(button.getAttribute("data-price"));

        addToCart(button, name, price);
      });
    });

    function addToCart(button, name, price) {
      const item = cart.find((item) => item.name === name);
      if (item) {
        item.quantity++;
      } else {
        cart.push({ name, price, quantity: 1 });
        const button1 = document.createElement("button");
        button1.textContent = "-";
        button1.className = "btn btn-danger add-to-cart new-button ";
        const button2 = document.createElement("button");
        button2.textContent = "+";
        button2.className = "btn btn-success add-to-cart new-button ";
        button2.addEventListener('click',(b2)=>increaseQuant(item,b2.target))
        const wrapButton = document.createElement("div");
        wrapButton.className = "wrapButton";
        const parentElement = button.parentNode;
        button.hidden = true;
        const item = cart.find((item) => item.name === name);
        const quant = document.createElement("span");
        quant.textContent = item.quantity;
        quant.className = "quantity px-2";
        button1.addEventListener("click", (b1) => removeItem(name, button, b1.target));
        wrapButton.appendChild(button1);
        wrapButton.appendChild(quant);
        wrapButton.appendChild(button2);
        parentElement.appendChild(wrapButton);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    }

    function increaseQuant(item, b2){
        item.quantity++;
        b2.parentNode.children[1].textContent = item.quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }

    function removeItem(name, button, b1) {
      const item = cart.find((item) => item.name === name);
      item.quantity--;
      b1.parentNode.children[1].textContent = item.quantity;
      if (item.quantity === 0) {
        button.hidden = false;
        let index = -1;

        
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].name === name) {
            index = i; 
            break; 
          }
        }
        cart.splice(index, 1);
        
        button.parentNode.removeChild(button.parentNode.children[3]);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    }

    function updateCartCount() {
      document.getElementById("cart-count").textContent = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
    }

    document
      .getElementById("search-bar")
      .addEventListener("input", function () {
        const query = this.value;
        if (query.length === 0) {
          document.getElementById("row").hidden = false;
        }
        if (query.length > 0) {
          document.getElementById("row").hidden = true;
          fetch(`/search?query=${query}&page=1`)
            .then((response) => response.json())
            .then((data) => {
              const resultsContainer =
                document.getElementById("search-results");
              resultsContainer.innerHTML = "";
              data.items.forEach((item) => {
                const div = document.createElement("div");
                let name = item.name;
                let price = item.price;
                div.className = "col-md-4 mb-4";
                div.innerHTML = `
                            <div class="card">
                                <img src="${
                                  item.image
                                }" class="card-img-top" alt="${item.name}">
                                <div class="details card-body">
                                    <h4 class="card-title">${item.name}</h4>
                                    <h6 class="card-title">${item.brand}</h6>
                                    <p class="card-text"><i>${item.description}</i></p>
                                    <p class="card-text"><b>₹${item.price}</b></p>
                                    <button class="btn btn-primary add-to-cart" data-name="${name}" data-price="${price}">Add to Cart</button>
                                </div>
                                </div>
                            `;
                resultsContainer.appendChild(div);
              });
              setupPagination(data.totalPages);
            });
        } else {
          document.getElementById("search-results").innerHTML = "";
        }
      });

    function setupPagination(totalPages) {
      const paginationContainer = document.getElementById("pagination");
      paginationContainer.innerHTML = "";
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = "btn btn-primary mx-1";
        button.addEventListener("click", () => loadPage(i));
        paginationContainer.appendChild(button);
      }
    }

    function loadPage(page) {
      const query = document.getElementById("search-bar").value;
      fetch(`/search?query=${query}&page=${page}`)
        .then((response) => response.json())
        .then((data) => {
          const resultsContainer =
            document.getElementById("search-results");
          resultsContainer.innerHTML = "";
          data.items.forEach((item) => {
            const div = document.createElement("div");
            div.className = "result-item";
            div.innerHTML = `
                            <img src="${item.image}" alt="${item.name}">
                            <div class="details">
                                <h5><a href="/product/${item.name.toLowerCase()}">${
              item.name
            }</a></h5>
                                <p>$${item.price}</p>
                            </div>
                        `;
            resultsContainer.appendChild(div);
          });
        });
    }
  });

  window.onload = function () {
    localStorage.clear();
   
  };
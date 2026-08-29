const CART_KEY = 'stick-cart';

const money = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const fmt = value => money.format(Number(value || 0));


/* =========================================================
   UTILIDADES
   ========================================================= */

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
  })[character]);
}


/* =========================================================
   TOAST
   ========================================================= */

window.showToast = message => {
  const toast = document.getElementById('toast');

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  window.clearTimeout(window.stickToastTimer);

  window.stickToastTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
};


/* =========================================================
   CARRINHO
   ========================================================= */

function getCart() {
  try {
    const cart = JSON.parse(
      localStorage.getItem(CART_KEY) || '[]'
    );

    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}


function setCart(cart) {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );

  updateCartBadge();
}


function cartTotals() {
  const cart = getCart();

  return {
    count: cart.reduce(
      (total, item) =>
        total + Number(item.qty || 0),
      0
    ),

    total: cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
        Number(item.qty || 0),
      0
    )
  };
}


function updateCartBadge() {
  const totals = cartTotals();

  document
    .querySelectorAll('[data-cart-count]')
    .forEach(element => {
      element.textContent = totals.count;

      element.setAttribute(
        'aria-label',
        `${totals.count} item(ns) no carrinho`
      );
    });

  document
    .querySelectorAll('[data-cart-total]')
    .forEach(element => {
      element.textContent = fmt(totals.total);
    });
}


/* =========================================================
   PRODUTOS
   ========================================================= */

function findProduct(slug) {
  return (window.STICK_PRODUCTS || [])
    .find(product => product.slug === slug);
}


function addToCart(
  slug,
  qty = 1,
  variant = '5x5 cm',
  artworkName = ''
) {
  const product = findProduct(slug);

  if (!product) {
    showToast(
      'Não foi possível adicionar este produto.'
    );

    return;
  }

  const cart = getCart();

  const key = `${slug}|${variant}`;

  const currentItem = cart.find(
    item => item.key === key
  );

  if (currentItem) {
    currentItem.qty += qty;

    if (artworkName) {
      currentItem.artworkName = artworkName;
    }
  } else {
    cart.push({
      key,
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      qty,
      variant,
      material: product.material,
      artworkName
    });
  }

  setCart(cart);

  showToast(
    'Produto adicionado ao carrinho.'
  );
}


window.addToCart = addToCart;


/* =========================================================
   ÍCONE DO CARRINHO
   ========================================================= */

function cartIcon() {
  return `
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M3 4h2l2 11h10l2-7H7"/>
      <circle cx="9" cy="19" r="1.5"/>
      <circle cx="17" cy="19" r="1.5"/>
    </svg>
  `;
}


/* =========================================================
   CARD DE PRODUTO
   ========================================================= */

function productCard(product) {
  const slug = encodeURIComponent(product.slug);

  return `
    <article class="product-card">

      <a
        class="product-image"
        href="produto.html?slug=${slug}"
      >
        <img
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
        >
      </a>

      <div class="product-card-copy">

        <a href="produto.html?slug=${slug}">
          <h3 class="product-name">
            ${escapeHTML(product.name)}
          </h3>
        </a>

        <p class="meta">
          ${escapeHTML(product.format || '')}
          ·
          ${escapeHTML(product.material || '')}
        </p>

        <div class="price">
          ${fmt(product.price)}

          <small>
            a partir de
          </small>
        </div>

      </div>

      <button
        class="quick"
        type="button"
        data-add-slug="${escapeHTML(product.slug)}"
        aria-label="Adicionar ${escapeHTML(product.name)} ao carrinho"
      >
        ${cartIcon()}
      </button>

    </article>
  `;
}


/* =========================================================
   CATÁLOGO
   ========================================================= */

function currentCatalogItems() {
  let items = [
    ...(window.STICK_PRODUCTS || [])
  ];

  const params =
    new URLSearchParams(location.search);

  const category =
    params.get('categoria');

  const search =
    (params.get('q') || '')
      .trim()
      .toLocaleLowerCase('pt-BR');


  if (category) {
    const normalizedCategory =
      category.toLocaleLowerCase('pt-BR');

    items = items.filter(product => {
      const searchable =
        `${product.category} ${product.name}`
          .toLocaleLowerCase('pt-BR');

      return searchable.includes(
        normalizedCategory
      );
    });
  }


  if (search) {
    items = items.filter(product => {
      const searchable =
        `${product.name} ${product.category} ${product.material} ${product.format}`
          .toLocaleLowerCase('pt-BR');

      return searchable.includes(search);
    });
  }


  return items;
}


/* =========================================================
   GRID DE PRODUTOS
   ========================================================= */

function renderGrid(grid, items) {
  const limit =
    Number(
      grid.dataset.limit ||
      items.length
    );

  grid.innerHTML =
    items
      .slice(0, limit)
      .map(productCard)
      .join('');


  grid
    .querySelectorAll('[data-add-slug]')
    .forEach(button => {
      button.addEventListener(
        'click',
        () => {
          addToCart(
            button.dataset.addSlug
          );
        }
      );
    });
}


function renderGrids() {
  document
    .querySelectorAll('[data-product-grid]')
    .forEach(grid => {
      renderGrid(
        grid,
        currentCatalogItems()
      );
    });
}


/* =========================================================
   BUSCA
   ========================================================= */

function setupSearch() {
  document
    .querySelectorAll('[data-search-form]')
    .forEach(form => {

      form.addEventListener(
        'submit',
        event => {

          event.preventDefault();

          const search =
            form
              .querySelector(
                'input[type="search"]'
              )
              ?.value
              .trim();

          const category =
            form
              .querySelector('select')
              ?.value;

          const params =
            new URLSearchParams();


          if (search) {
            params.set('q', search);
          }

          if (category) {
            params.set(
              'categoria',
              category
            );
          }


          location.href =
            `catalogo.html${
              params.size
                ? `?${params}`
                : ''
            }`;
        }
      );

    });
}


/* =========================================================
   CARROSSEL
   ========================================================= */

function setupCarousels() {

  // Tolerância em px para considerar o trilho encostado na borda.
  const EDGE = 4;


  document
    .querySelectorAll('[data-carousel]')
    .forEach(shell => {

      const track =
        shell.querySelector(
          '.carousel-track'
        );

      const buttons = [
        ...shell.querySelectorAll(
          '[data-dir]'
        )
      ];

      if (
        !track ||
        !buttons.length
      ) {
        return;
      }


      const slideTo = left => {
        track.scrollTo({
          left,
          behavior: 'smooth'
        });
      };


      buttons.forEach(button => {

        // Loop infinito: as setas nunca ficam sem destino.
        button.disabled = false;


        button.addEventListener(
          'click',
          () => {

            const maxScroll =
              track.scrollWidth -
              track.clientWidth;


            // Conteúdo cabe inteiro: nada para percorrer.
            if (maxScroll <= EDGE) {
              return;
            }


            const step =
              track.clientWidth * 0.92;

            const current =
              track.scrollLeft;


            if (
              button.dataset.dir === 'next'
            ) {

              // No último slide, volta ao primeiro.
              slideTo(
                current >= maxScroll - EDGE
                  ? 0
                  : Math.min(
                      current + step,
                      maxScroll
                    )
              );

            } else {

              // No primeiro slide, vai para o último.
              slideTo(
                current <= EDGE
                  ? maxScroll
                  : Math.max(
                      current - step,
                      0
                    )
              );

            }

          }
        );

      });

    });
}


/* =========================================================
   FILTROS DO CATÁLOGO
   ========================================================= */

function setupFilters() {
  const form =
    document.getElementById('filters');

  const grid =
    document.querySelector(
      '.catalog-main [data-product-grid]'
    );

  const sort =
    document.getElementById(
      'catalogSort'
    );

  const toggle =
    document.getElementById(
      'filterToggle'
    );


  if (
    !form ||
    !grid
  ) {
    return;
  }


  const applyFilters = () => {

    let items =
      currentCatalogItems();


    const selectedGroups = [
      ...form.querySelectorAll(
        '.filter-group'
      )
    ]
      .map(group =>
        [
          ...group.querySelectorAll(
            'input:checked'
          )
        ].map(input =>
          input.value
            .toLocaleLowerCase(
              'pt-BR'
            )
        )
      )
      .filter(values =>
        values.length
      );


    if (selectedGroups.length) {
      items =
        items.filter(product => {

          const searchable =
            `${product.name} ${product.category} ${product.format} ${product.material}`
              .toLocaleLowerCase(
                'pt-BR'
              );

          return selectedGroups
            .every(values =>
              values.some(value =>
                searchable.includes(
                  value
                )
              )
            );

        });
    }


    if (
      sort?.value === 'price-asc'
    ) {
      items.sort(
        (a, b) =>
          a.price - b.price
      );
    }


    if (
      sort?.value === 'price-desc'
    ) {
      items.sort(
        (a, b) =>
          b.price - a.price
      );
    }


    renderGrid(
      grid,
      items
    );


    const foundCount =
      document.getElementById(
        'foundCount'
      );

    if (foundCount) {
      foundCount.textContent =
        items.length;
    }


    const catalogEmpty =
      document.getElementById(
        'catalogEmpty'
      );

    if (catalogEmpty) {
      catalogEmpty.hidden =
        Boolean(items.length);
    }

  };


  form.addEventListener(
    'change',
    applyFilters
  );


  sort?.addEventListener(
    'change',
    applyFilters
  );


  toggle?.addEventListener(
    'click',
    () => {

      const expanded =
        toggle.getAttribute(
          'aria-expanded'
        ) === 'true';

      toggle.setAttribute(
        'aria-expanded',
        String(!expanded)
      );

      form.classList.toggle(
        'is-open',
        !expanded
      );

    }
  );


  applyFilters();
}


/* =========================================================
   GALERIA DO PRODUTO
   ========================================================= */

function setupProductGallery(product) {
  const mainImage =
    document.getElementById(
      'pdImage'
    );

  if (!mainImage) return;


  mainImage.alt =
    product.name;


  const firstThumbnail =
    document.querySelector(
      '[data-gallery-image]'
    );


  if (firstThumbnail) {

    firstThumbnail.dataset.galleryImage =
      mainImage.getAttribute('src');

    const preview =
      firstThumbnail.querySelector(
        'img'
      );


    if (
      product.slug !==
        'adesivo-redondo-personalizado' &&
      preview
    ) {

      preview.src =
        product.image;

      preview.alt =
        product.name;
    }

  }


  document
    .querySelectorAll(
      '[data-gallery-image]'
    )
    .forEach(
      (button, index) => {

        if (index === 0) {
          button.classList.add(
            'active'
          );
        }


        button.addEventListener(
          'click',
          () => {

            document
              .querySelectorAll(
                '[data-gallery-image]'
              )
              .forEach(item =>
                item.classList.remove(
                  'active'
                )
              );


            button.classList.add(
              'active'
            );


            mainImage.src =
              button.dataset.galleryImage;


            mainImage.alt =
              button
                .querySelector('img')
                ?.alt ||
              product.name;

          }
        );

      }
    );
}


/* =========================================================
   PÁGINA DO PRODUTO
   ========================================================= */

function renderProductPage() {
  const box =
    document.getElementById(
      'productDetail'
    );

  if (!box) return;


  const slug =
    new URLSearchParams(
      location.search
    ).get('slug') ||
    'adesivo-redondo-personalizado';


  const product =
    findProduct(slug);


  if (!product) {

    box.innerHTML = `
      <div class="container empty-state">

        <h1>
          Produto não encontrado
        </h1>

        <p>
          Volte ao catálogo para
          escolher outro item.
        </p>

        <a
          class="btn btn-blue"
          href="catalogo.html"
        >
          Ver catálogo
        </a>

      </div>
    `;

    return;
  }


  const pdName =
    document.getElementById(
      'pdName'
    );

  const pdPrice =
    document.getElementById(
      'pdPrice'
    );

  const image =
    document.getElementById(
      'pdImage'
    );


  if (pdName) {
    pdName.textContent =
      product.name;
  }

  if (pdPrice) {
    pdPrice.textContent =
      fmt(product.price);
  }


  if (image) {

    image.src =
      product.slug ===
      'adesivo-redondo-personalizado'
        ? 'assets/img/product-main.png'
        : product.image;

  }


  document.title =
    `${product.name} | Stick Adesivos`;


  setupProductGallery(product);


  document
    .querySelectorAll('.variant')
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          document
            .querySelectorAll(
              '.variant'
            )
            .forEach(item => {

              item.classList.remove(
                'active'
              );

              item.setAttribute(
                'aria-pressed',
                'false'
              );

            });


          button.classList.add(
            'active'
          );

          button.setAttribute(
            'aria-pressed',
            'true'
          );

        }
      );

    });


  const qtyValue =
    document.getElementById(
      'qtyValue'
    );


  if (qtyValue) {

    const setQuantity = value => {

      const quantity =
        Math.max(
          1,
          value
        );

      qtyValue.dataset.qty =
        quantity;

      qtyValue.textContent =
        `${quantity * 100} unidades`;

    };


    document
      .getElementById('qtyMinus')
      ?.addEventListener(
        'click',
        () => {

          setQuantity(
            Number(
              qtyValue.dataset.qty ||
              1
            ) - 1
          );

        }
      );


    document
      .getElementById('qtyPlus')
      ?.addEventListener(
        'click',
        () => {

          setQuantity(
            Number(
              qtyValue.dataset.qty ||
              1
            ) + 1
          );

        }
      );

  }


  const artworkInput =
    document.getElementById(
      'artworkInput'
    );

  const artworkName =
    document.getElementById(
      'artworkName'
    );


  artworkInput?.addEventListener(
    'change',
    () => {

      const file =
        artworkInput.files?.[0];

      if (!file) return;


      if (
        file.size >
        20 * 1024 * 1024
      ) {

        artworkInput.value = '';

        if (artworkName) {

          artworkName.textContent =
            'O arquivo deve ter no máximo 20 MB.';

          artworkName.classList.add(
            'field-error'
          );

        }

        return;
      }


      if (artworkName) {

        artworkName.textContent =
          file.name;

        artworkName.classList.remove(
          'field-error'
        );

      }

    }
  );


  document
    .getElementById(
      'shippingForm'
    )
    ?.addEventListener(
      'submit',
      event => {

        event.preventDefault();

        const cep =
          document.getElementById(
            'shippingCep'
          );

        if (
          cep &&
          !cep.checkValidity()
        ) {

          cep.reportValidity();

          return;
        }


        showToast(
          'O cálculo de frete será concluído pela loja integrada.'
        );

      }
    );


  document
    .getElementById(
      'addProductBtn'
    )
    ?.addEventListener(
      'click',
      () => {

        const quantity =
          Number(
            qtyValue?.dataset.qty ||
            1
          );

        const variant =
          document.querySelector(
            '.variant.active'
          )?.dataset.variant ||
          '5x5 cm';


        addToCart(
          product.slug,
          quantity,
          variant,
          artworkInput
            ?.files?.[0]
            ?.name ||
          ''
        );

      }
    );
}


/* =========================================================
   PÁGINA DO CARRINHO
   ========================================================= */

function renderCart() {
  const box =
    document.getElementById(
      'cartRows'
    );

  if (!box) return;


  const cart =
    getCart();

  const table =
    box.closest('.cart-table');


  if (!cart.length) {

    table?.classList.remove(
      'single-item'
    );

    box.innerHTML = `
      <div class="empty-state">

        <h2>
          Seu carrinho está vazio
        </h2>

        <p>
          Escolha um produto e volte
          aqui para revisar o pedido.
        </p>

        <a
          class="btn btn-blue"
          href="catalogo.html"
        >
          Ver produtos
        </a>

      </div>
    `;


    const summary =
      document.getElementById(
        'cartSummary'
      );

    const actions =
      document.getElementById(
        'cartActions'
      );


    if (summary) {
      summary.hidden = true;
    }

    if (actions) {
      actions.hidden = true;
    }


    return;
  }


  /*
   * Modo "item único": uma só linha com quantidade 1.
   * Nesse caso o "−" não teria efeito (a quantidade
   * já é a mínima) e o subtotal repetiria o preço
   * unitário — então trocamos o "−" por uma lixeira
   * e escondemos a coluna de subtotal.
   */
  const singleItem =
    cart.length === 1 &&
    Number(cart[0].qty) === 1;


  table?.classList.toggle(
    'single-item',
    singleItem
  );


  box.innerHTML =
    cart
      .map((item, index) => `
        <div class="cart-row">

          <div class="cart-prod">

            <img
              src="${escapeHTML(item.image)}"
              alt="${escapeHTML(item.name)}"
            >

            <div>

              <strong>
                ${escapeHTML(item.name)}
              </strong>

              <small>
                ${escapeHTML(item.variant)}
                ·
                ${escapeHTML(item.material)}

                ${
                  item.artworkName
                    ? `<br>Arte: ${escapeHTML(item.artworkName)}`
                    : '<br>Arte: enviar depois'
                }
              </small>

            </div>

          </div>


          <div class="cart-unit">

            <span class="mobile-label">
              Preço
            </span>

            <strong>
              ${fmt(item.price)}
            </strong>

          </div>


          <div
            class="qty"
            aria-label="Quantidade de pacotes"
          >

            ${
              singleItem
                ? `
                    <button
                      class="qty-trash"
                      type="button"
                      data-cart-remove="${index}"
                      aria-label="Remover ${escapeHTML(item.name)} do carrinho"
                      title="Remover do carrinho"
                    >
                      ${trashIcon()}
                    </button>
                  `
                : `
                    <button
                      type="button"
                      data-cart-qty="${index}"
                      data-delta="-1"
                      aria-label="Diminuir quantidade"
                    >
                      −
                    </button>
                  `
            }

            <span>
              ${item.qty}
            </span>

            <button
              type="button"
              data-cart-qty="${index}"
              data-delta="1"
              aria-label="Aumentar quantidade"
            >
              +
            </button>

          </div>


          ${
            singleItem
              ? ''
              : `
                  <div class="cart-sub">

                    <span class="mobile-label">
                      Subtotal
                    </span>

                    ${fmt(
                      item.price *
                      item.qty
                    )}

                  </div>
                `
          }

        </div>
      `)
      .join('');


  box
    .querySelectorAll(
      '[data-cart-qty]'
    )
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          const updatedCart =
            getCart();

          const index =
            Number(
              button.dataset.cartQty
            );

          /*
           * O "−" apenas diminui: trava em 1.
           * A remoção da linha é feita pela lixeira.
           */
          updatedCart[index].qty =
            Math.max(
              1,
              updatedCart[index].qty +
              Number(
                button.dataset.delta
              )
            );


          setCart(
            updatedCart
          );

          renderCart();

        }
      );

    });


  box
    .querySelectorAll(
      '[data-cart-remove]'
    )
    .forEach(button => {

      button.addEventListener(
        'click',
        () => {

          const updatedCart =
            getCart();

          updatedCart.splice(
            Number(
              button.dataset.cartRemove
            ),
            1
          );

          setCart(
            updatedCart
          );

          renderCart();

          showToast(
            'Item removido do carrinho.'
          );

        }
      );

    });


  updateCartSummary();
}


/* Ícone de lixeira usado na remoção de item único. */
function trashIcon() {
  return `
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h16"/>
      <path d="M9 7V4h6v3"/>
      <path d="m6 7 1 13h10l1-13"/>
      <path d="M10 11v6M14 11v6"/>
    </svg>
  `;
}


/* =========================================================
   RESUMO DO CARRINHO
   ========================================================= */

function updateCartSummary() {
  const totals =
    cartTotals();

  const subtotal =
    document.getElementById(
      'sumSubtotal'
    );

  const total =
    document.getElementById(
      'sumTotal'
    );


  if (subtotal) {
    subtotal.textContent =
      fmt(totals.total);
  }


  if (total) {
    total.textContent =
      fmt(totals.total);
  }
}


/* =========================================================
   AÇÕES DO CARRINHO
   ========================================================= */

function setupCartActions() {

  document
    .getElementById(
      'emptyCartButton'
    )
    ?.addEventListener(
      'click',
      () => {

        setCart([]);

        renderCart();

        showToast(
          'Carrinho esvaziado.'
        );

      }
    );


  document
    .getElementById(
      'cartShippingButton'
    )
    ?.addEventListener(
      'click',
      () => {

        showToast(
          'O frete será calculado no checkout.'
        );

      }
    );


  document
    .getElementById(
      'helpButton'
    )
    ?.addEventListener(
      'click',
      () => {

        location.href =
          'contato.html?assunto=Ajuda%20com%20o%20pedido';

      }
    );
}


/* =========================================================
   CHECKOUT
   ========================================================= */

function renderCheckout() {
  const box =
    document.getElementById(
      'checkoutItems'
    );

  if (!box) return;


  const cart =
    getCart();

  const totals =
    cartTotals();

  const shipping = 0;


  box.innerHTML =
    cart.length
      ? cart
          .map(item => `
            <div class="mini">

              <img
                src="${escapeHTML(item.image)}"
                alt=""
              >

              <div>

                <strong>
                  ${escapeHTML(item.name)}
                </strong>

                <small>
                  ${escapeHTML(item.variant)}
                  ·
                  ${escapeHTML(item.material)}
                  <br>
                  Qtd.: ${item.qty}
                </small>

              </div>

              <strong>
                ${fmt(
                  item.price *
                  item.qty
                )}
              </strong>

            </div>
          `)
          .join('')

      : `
          <div class="empty-checkout">

            <p>
              Seu carrinho está vazio.
            </p>

            <a href="catalogo.html">
              Voltar ao catálogo
            </a>

          </div>
        `;


  const checkoutCount =
    document.getElementById(
      'checkoutCount'
    );

  const checkoutSubtotal =
    document.getElementById(
      'checkoutSubtotal'
    );

  const checkoutShipping =
    document.getElementById(
      'checkoutShipping'
    );

  const checkoutTotal =
    document.getElementById(
      'checkoutTotal'
    );


  if (checkoutCount) {
    checkoutCount.textContent =
      `${totals.count} item(ns)`;
  }

  if (checkoutSubtotal) {
    checkoutSubtotal.textContent =
      fmt(totals.total);
  }

  if (checkoutShipping) {
    checkoutShipping.textContent =
      cart.length
        ? 'A combinar'
        : fmt(0);
  }

  if (checkoutTotal) {
    checkoutTotal.textContent =
      fmt(
        totals.total +
        shipping
      );
  }


  const submit =
    document.getElementById(
      'checkoutSubmit'
    );


  if (submit) {
    submit.disabled =
      !cart.length;
  }
}


function setupCheckout() {
  const form =
    document.getElementById(
      'checkoutForm'
    );

  if (!form) return;


  aplicarMascaraCPF(
    form.querySelector('#document')
  );

  aplicarMascaraTelefone(
    form.querySelector('#phone')
  );

  aplicarMascaraCEP(
    form.querySelector('#postalCode')
  );

  setupBuscaCEP(form);

  setupParcelas(form);


  form.addEventListener(
    'submit',
    event => {

      event.preventDefault();


      if (
        !form.reportValidity()
      ) {
        return;
      }


      // CPF e CEP têm validação própria, além do HTML.
      if (
        !validarCampoCPF(form) ||
        !validarCampoCEP(form)
      ) {
        return;
      }


      showToast(
        'Checkout demonstrativo: o pedido será finalizado pela Nuvemshop.'
      );

    }
  );
}


/* =========================================================
   MÁSCARAS DE ENTRADA
   ========================================================= */

/*
 * Mantém apenas dígitos e corta no comprimento máximo.
 * Base de todas as máscaras abaixo.
 */
function somenteDigitos(value, max) {
  return String(value || '')
    .replace(/\D/g, '')
    .slice(0, max);
}


/*
 * Reaplica a máscara a cada digitação. Quando o cursor
 * está no fim do campo, mantém ele no fim depois de
 * reescrever o valor.
 */
function ligarMascara(input, formatar) {
  if (!input) return;

  const aplicar = () => {
    const noFim =
      input.selectionStart ===
      input.value.length;

    input.value =
      formatar(input.value);

    if (noFim) {
      const pos = input.value.length;
      input.setSelectionRange(pos, pos);
    }
  };

  input.addEventListener('input', aplicar);

  // Cobre autopreenchimento do navegador e colagem.
  input.addEventListener('change', aplicar);

  if (input.value) aplicar();
}


/* Formata CPF como 000.000.000-00. */
function formatarCPF(value) {
  const d = somenteDigitos(value, 11);

  if (d.length <= 3) return d;

  if (d.length <= 6) {
    return d.replace(
      /^(\d{3})(\d+)/,
      '$1.$2'
    );
  }

  if (d.length <= 9) {
    return d.replace(
      /^(\d{3})(\d{3})(\d+)/,
      '$1.$2.$3'
    );
  }

  return d.replace(
    /^(\d{3})(\d{3})(\d{3})(\d+)/,
    '$1.$2.$3-$4'
  );
}


/* Aplica a máscara de CPF ao campo. */
function aplicarMascaraCPF(input) {
  ligarMascara(input, formatarCPF);
}


/* Formata telefone como (00) 00000-0000. */
function formatarTelefone(value) {
  const d = somenteDigitos(value, 11);

  if (!d) return '';

  if (d.length <= 2) {
    return '(' + d;
  }

  if (d.length <= 7) {
    return d.replace(
      /^(\d{2})(\d+)/,
      '($1) $2'
    );
  }

  return d.replace(
    /^(\d{2})(\d{5})(\d+)/,
    '($1) $2-$3'
  );
}


/* Aplica a máscara de telefone ao campo. */
function aplicarMascaraTelefone(input) {
  ligarMascara(input, formatarTelefone);
}


/* Formata CEP como 00000-000. */
function formatarCEP(value) {
  const d = somenteDigitos(value, 8);

  return d.length > 5
    ? d.replace(/^(\d{5})(\d+)/, '$1-$2')
    : d;
}


/* Aplica a máscara de CEP ao campo. */
function aplicarMascaraCEP(input) {
  ligarMascara(input, formatarCEP);
}


/* =========================================================
   MENSAGENS DE ERRO DE CAMPO
   ========================================================= */

/*
 * Cria (uma vez) e atualiza a mensagem de erro logo
 * abaixo do campo. Mensagem vazia limpa o erro.
 */
function mostrarErroCampo(input, mensagem) {
  if (!input) return;

  const field =
    input.closest('.field') ||
    input.parentElement;

  if (!field) return;


  let alvo =
    field.querySelector(
      '[data-field-message]'
    );

  if (!alvo) {
    alvo = document.createElement('small');
    alvo.dataset.fieldMessage = '';
    alvo.className = 'field-error';
    field.appendChild(alvo);
  }

  alvo.textContent = mensagem || '';
  alvo.hidden = !mensagem;

  input.setAttribute(
    'aria-invalid',
    mensagem ? 'true' : 'false'
  );

  // Integra com a validação nativa do formulário.
  input.setCustomValidity(mensagem || '');
}


/* =========================================================
   VALIDAÇÃO DE CPF
   ========================================================= */

/*
 * Algoritmo oficial dos dígitos verificadores.
 * Aceita CPF com ou sem pontuação: normaliza antes.
 */
function validarCPF(value) {
  const cpf = somenteDigitos(value, 11);

  if (cpf.length !== 11) return false;

  // Sequências repetidas (000..., 111...) são inválidas.
  if (/^(\d)\1{10}$/.test(cpf)) return false;


  const digito = ate => {
    let soma = 0;
    let peso = ate + 1;

    for (let i = 0; i < ate; i++) {
      soma += Number(cpf[i]) * peso;
      peso--;
    }

    const resto = (soma * 10) % 11;

    return resto === 10 ? 0 : resto;
  };


  return (
    digito(9) === Number(cpf[9]) &&
    digito(10) === Number(cpf[10])
  );
}


/* Valida o campo de CPF do formulário e exibe o erro. */
function validarCampoCPF(form) {
  const input =
    form.querySelector('#document');

  if (!input) return true;

  const ok = validarCPF(input.value);

  mostrarErroCampo(
    input,
    ok
      ? ''
      : 'CPF inválido. Confira os números digitados.'
  );

  if (!ok) {
    input.reportValidity();
  }

  return ok;
}


/* =========================================================
   CEP: BUSCA E PREENCHIMENTO (ViaCEP)
   ========================================================= */

/*
 * Consulta a ViaCEP. Retorna o endereço encontrado,
 * ou null quando o CEP não existe.
 */
async function buscarCEP(cep) {
  const limpo = somenteDigitos(cep, 8);

  if (limpo.length !== 8) return null;


  const resposta =
    await fetch(
      'https://viacep.com.br/ws/' +
      limpo +
      '/json/'
    );

  if (!resposta.ok) return null;

  const dados = await resposta.json();

  return dados.erro ? null : dados;
}


/*
 * Preenche Endereço, Bairro, Cidade e Estado.
 * Número e Complemento ficam em branco, para o usuário.
 */
function preencherEndereco(form, dados) {
  const mapa = {
    '#address': dados.logradouro,
    '#district': dados.bairro,
    '#city': dados.localidade,
    '#state': dados.uf
  };

  Object.keys(mapa).forEach(seletor => {

    const campo =
      form.querySelector(seletor);

    if (campo && mapa[seletor]) {
      campo.value = mapa[seletor];
    }

  });
}


/*
 * Liga a busca ao blur do campo de CEP e registra o
 * resultado em data-cep-valido, que o submit consulta.
 */
function setupBuscaCEP(form) {
  const input =
    form.querySelector('#postalCode');

  if (!input) return;


  const consultar = async () => {
    const limpo =
      somenteDigitos(input.value, 8);


    if (!limpo) {
      mostrarErroCampo(input, '');
      input.dataset.cepValido = '';
      return;
    }


    if (limpo.length !== 8) {
      mostrarErroCampo(
        input,
        'CEP incompleto. Use o formato 00000-000.'
      );
      input.dataset.cepValido = 'nao';
      return;
    }


    mostrarErroCampo(input, '');


    try {
      const dados = await buscarCEP(limpo);

      if (!dados) {
        mostrarErroCampo(
          input,
          'CEP não encontrado. Verifique o número digitado.'
        );
        input.dataset.cepValido = 'nao';
        return;
      }

      preencherEndereco(form, dados);
      input.dataset.cepValido = 'sim';

    } catch (erro) {
      mostrarErroCampo(
        input,
        'Não foi possível consultar o CEP agora. Tente novamente.'
      );
      input.dataset.cepValido = 'nao';
    }
  };


  input.addEventListener('blur', consultar);

  // Botão "Buscar CEP", caso venha a existir no HTML.
  form
    .querySelector('[data-buscar-cep]')
    ?.addEventListener('click', consultar);
}


/* Bloqueia o envio enquanto o CEP não for válido. */
function validarCampoCEP(form) {
  const input =
    form.querySelector('#postalCode');

  if (!input) return true;


  const limpo =
    somenteDigitos(input.value, 8);

  if (limpo.length !== 8) {
    mostrarErroCampo(
      input,
      'CEP incompleto. Use o formato 00000-000.'
    );
    input.reportValidity();
    return false;
  }


  if (input.dataset.cepValido === 'nao') {
    mostrarErroCampo(
      input,
      'CEP não encontrado. Verifique o número digitado.'
    );
    input.reportValidity();
    return false;
  }


  mostrarErroCampo(input, '');
  return true;
}


/* =========================================================
   PARCELAMENTO NO CARTÃO
   ========================================================= */

// Teto de parcelas e valor mínimo de cada parcela.
const MAX_PARCELAS = 12;
const PARCELA_MINIMA = 5;


/*
 * Monta as opções de parcelamento sem juros.
 * Para quando a parcela ficaria abaixo do mínimo.
 */
function calcularParcelas(total) {
  const opcoes = [];

  if (!(total > 0)) return opcoes;


  for (let n = 1; n <= MAX_PARCELAS; n++) {

    const valor = total / n;

    if (n > 1 && valor < PARCELA_MINIMA) break;

    opcoes.push({
      parcelas: n,
      valor,
      rotulo:
        n + 'x de ' + fmt(valor) +
        (n > 1 ? ' sem juros' : ' à vista')
    });
  }

  return opcoes;
}


/*
 * Exibe o seletor de parcelas apenas no cartão de
 * crédito, e o esconde quando não há parcelamento.
 */
function setupParcelas(form) {
  const campo =
    document.getElementById(
      'installmentsField'
    );

  const select =
    document.getElementById(
      'installments'
    );

  if (!campo || !select) return;


  const atualizar = () => {

    const cartao =
      form.querySelector(
        'input[name="payment"]:checked'
      )?.value === 'card';

    const opcoes =
      calcularParcelas(
        cartTotals().total
      );


    // Sem cartão ou sem parcelamento: esconde e desliga.
    if (!cartao || opcoes.length < 2) {
      campo.hidden = true;
      select.disabled = true;
      select.innerHTML = '';
      return;
    }


    const escolhido = select.value;

    select.innerHTML =
      opcoes
        .map(opcao =>
          '<option value="' +
          opcao.parcelas +
          '">' +
          escapeHTML(opcao.rotulo) +
          '</option>'
        )
        .join('');

    // Preserva a escolha do usuário, se ainda existir.
    if (
      escolhido &&
      select.querySelector(
        'option[value="' + escolhido + '"]'
      )
    ) {
      select.value = escolhido;
    }

    campo.hidden = false;
    select.disabled = false;
  };


  form
    .querySelectorAll(
      'input[name="payment"]'
    )
    .forEach(radio => {
      radio.addEventListener(
        'change',
        atualizar
      );
    });


  atualizar();
}


/* =========================================================
   CONTATO
   ========================================================= */

function setupContactForm() {
  const form =
    document.getElementById(
      'contactForm'
    );

  if (!form) return;


  const subject =
    new URLSearchParams(
      location.search
    ).get('assunto');


  if (
    subject &&
    form.elements.subject
  ) {
    form.elements.subject.value =
      subject;
  }


  form.addEventListener(
    'submit',
    event => {

      event.preventDefault();


      if (
        !form.reportValidity()
      ) {
        return;
      }


      showToast(
        'Formulário pronto para conexão com o canal oficial.'
      );

    }
  );
}


/* =========================================================
   TÍTULO DO CATÁLOGO
   ========================================================= */

function syncCatalogHeading(activeLink) {
  const category =
    new URLSearchParams(
      location.search
    ).get('categoria');


  const heading =
    document.querySelector(
      '.page-hero h1'
    );


  if (
    !category ||
    !heading ||
    !activeLink
  ) {
    return;
  }


  const label =
    activeLink
      .textContent
      .trim()
      .toLocaleLowerCase(
        'pt-BR'
      )
      .replace(
        /^./,
        letter =>
          letter.toLocaleUpperCase(
            'pt-BR'
          )
      );


  const cut =
    label.lastIndexOf(' ');


  heading.innerHTML =
    cut > 0
      ? `
          ${escapeHTML(
            label.slice(
              0,
              cut
            )
          )}

          <span>
            ${escapeHTML(
              label.slice(
                cut + 1
              )
            )}
          </span>
        `
      : escapeHTML(label);


  const breadcrumb =
    document.querySelector(
      '.breadcrumb'
    );


  if (breadcrumb) {

    breadcrumb.innerHTML = `
      <a href="index.html">
        Página inicial
      </a>

      ›

      ${escapeHTML(label)}
    `;

  }


  document.title =
    `${label} | Stick Adesivos`;
}


/* =========================================================
   NAVEGAÇÃO
   DEFINE SOMENTE UM ITEM COMO ATIVO
   ========================================================= */

function setupNavigation() {
  const currentPage =
    location.pathname
      .split('/')
      .pop() ||
    'index.html';


  const currentParams =
    new URLSearchParams(
      location.search
    );


  const currentCategory =
    currentParams.get(
      'categoria'
    ) || '';


  const links = [
    ...document.querySelectorAll(
      '.nav a'
    )
  ];


  /*
   * Primeiro removemos qualquer "active"
   * que possa ter vindo escrito no HTML.
   */
  links.forEach(link => {
    link.classList.remove(
      'active'
    );
  });


  let activeLink = null;


  /*
   * HOME
   */
  if (
    currentPage ===
    'index.html'
  ) {

    activeLink =
      links.find(link => {

        const href =
          link.getAttribute(
            'href'
          );

        return (
          href === 'index.html'
        );

      });

  }


  /*
   * CATÁLOGO E CATEGORIAS
   */
  else if (
    currentPage ===
    'catalogo.html'
  ) {

    activeLink =
      links.find(link => {

        const href =
          link.getAttribute(
            'href'
          );

        if (!href) {
          return false;
        }


        const [
          page,
          query = ''
        ] = href.split('?');


        if (
          page !==
          'catalogo.html'
        ) {
          return false;
        }


        const linkParams =
          new URLSearchParams(
            query
          );


        const linkCategory =
          linkParams.get(
            'categoria'
          ) || '';


        return (
          linkCategory ===
          currentCategory
        );

      });

  }


  /*
   * PÁGINA DE PRODUTO
   *
   * Produto individual pertence à área
   * "Adesivos personalizados".
   */
  else if (
    currentPage ===
    'produto.html'
  ) {

    activeLink =
      links.find(link => {

        const href =
          link.getAttribute(
            'href'
          );

        return (
          href ===
          'catalogo.html'
        );

      });

  }


  /*
   * OUTRAS PÁGINAS
   * Sobre nós, contato etc.
   */
  else {

    activeLink =
      links.find(link => {

        const href =
          link.getAttribute(
            'href'
          );

        if (!href) {
          return false;
        }


        const page =
          href
            .split('?')[0];


        return (
          page ===
          currentPage
        );

      });

  }


  /*
   * Apenas UM link recebe active.
   */
  if (activeLink) {
    activeLink.classList.add(
      'active'
    );
  }


  /*
   * Se estivermos dentro de uma
   * categoria, atualiza também o
   * título da página.
   */
  syncCatalogHeading(
    activeLink
  );


  /*
   * Ano automático no rodapé.
   */
  document
    .querySelectorAll(
      '[data-current-year]'
    )
    .forEach(element => {

      element.textContent =
        new Date()
          .getFullYear();

    });
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    updateCartBadge();

    setupNavigation();

    setupSearch();

    renderGrids();

    setupFilters();

    setupCarousels();

    renderProductPage();

    renderCart();

    setupCartActions();

    renderCheckout();

    setupCheckout();

    setupContactForm();

  }
);
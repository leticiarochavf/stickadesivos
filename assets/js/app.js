const CART_KEY = 'stick-cart';
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const fmt = value => money.format(Number(value || 0));

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  })[character]);
}

window.showToast = message => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(window.stickToastTimer);
  window.stickToastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
};

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function cartTotals() {
  const cart = getCart();
  return {
    count: cart.reduce((total, item) => total + Number(item.qty || 0), 0),
    total: cart.reduce((total, item) => total + Number(item.price || 0) * Number(item.qty || 0), 0)
  };
}

function updateCartBadge() {
  const totals = cartTotals();
  document.querySelectorAll('[data-cart-count]').forEach(element => {
    element.textContent = totals.count;
    element.setAttribute('aria-label', `${totals.count} item(ns) no carrinho`);
  });
  document.querySelectorAll('[data-cart-total]').forEach(element => {
    element.textContent = fmt(totals.total);
  });
}

function findProduct(slug) {
  return (window.STICK_PRODUCTS || []).find(product => product.slug === slug);
}

function addToCart(slug, qty = 1, variant = '5x5 cm', artworkName = '') {
  const product = findProduct(slug);
  if (!product) {
    showToast('Não foi possível adicionar este produto.');
    return;
  }

  const cart = getCart();
  const key = `${slug}|${variant}`;
  const currentItem = cart.find(item => item.key === key);

  if (currentItem) {
    currentItem.qty += qty;
    if (artworkName) currentItem.artworkName = artworkName;
  } else {
    cart.push({
      key, id: product.id, slug: product.slug, name: product.name,
      price: product.price, image: product.image, qty, variant,
      material: product.material, artworkName
    });
  }

  setCart(cart);
  showToast('Produto adicionado ao carrinho.');
}

window.addToCart = addToCart;

function cartIcon() {
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2 11h10l2-7H7"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></svg>';
}

function productCard(product) {
  const slug = encodeURIComponent(product.slug);
  return `
    <article class="product-card">
      <a class="product-image" href="produto.html?slug=${slug}">
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
      </a>
      <div class="product-card-copy">
        <a href="produto.html?slug=${slug}"><h3 class="product-name">${escapeHTML(product.name)}</h3></a>
        <p class="meta">${escapeHTML(product.format || '')} · ${escapeHTML(product.material || '')}</p>
        <div class="price">${fmt(product.price)}<small>a partir de</small></div>
      </div>
      <button class="quick" type="button" data-add-slug="${escapeHTML(product.slug)}" aria-label="Adicionar ${escapeHTML(product.name)} ao carrinho">${cartIcon()}</button>
    </article>`;
}

function currentCatalogItems() {
  let items = [...(window.STICK_PRODUCTS || [])];
  const params = new URLSearchParams(location.search);
  const category = params.get('categoria');
  const search = (params.get('q') || '').trim().toLocaleLowerCase('pt-BR');

  if (category) {
    const normalizedCategory = category.toLocaleLowerCase('pt-BR');
    items = items.filter(product => `${product.category} ${product.name}`.toLocaleLowerCase('pt-BR').includes(normalizedCategory));
  }
  if (search) {
    items = items.filter(product => `${product.name} ${product.category} ${product.material} ${product.format}`.toLocaleLowerCase('pt-BR').includes(search));
  }
  return items;
}

function renderGrid(grid, items) {
  const limit = Number(grid.dataset.limit || items.length);
  grid.innerHTML = items.slice(0, limit).map(productCard).join('');
  grid.querySelectorAll('[data-add-slug]').forEach(button => {
    button.addEventListener('click', () => addToCart(button.dataset.addSlug));
  });
}

function renderGrids() {
  document.querySelectorAll('[data-product-grid]').forEach(grid => renderGrid(grid, currentCatalogItems()));
}

function setupSearch() {
  document.querySelectorAll('[data-search-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const search = form.querySelector('input[type="search"]')?.value.trim();
      const category = form.querySelector('select')?.value;
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (category) params.set('categoria', category);
      location.href = `catalogo.html${params.size ? `?${params}` : ''}`;
    });
  });
}

function setupCarousels() {
  document.querySelectorAll('[data-carousel]').forEach(shell => {
    const track = shell.querySelector('.carousel-track');
    const buttons = [...shell.querySelectorAll('[data-dir]')];
    if (!track || !buttons.length) return;

    const updateButtons = () => {
      const maxScroll = track.scrollWidth - track.clientWidth - 2;
      buttons.forEach(button => {
        button.disabled = button.dataset.dir === 'prev' ? track.scrollLeft <= 2 : track.scrollLeft >= maxScroll;
      });
    };

    buttons.forEach(button => button.addEventListener('click', () => {
      const direction = button.dataset.dir === 'next' ? 1 : -1;
      track.scrollBy({ left: track.clientWidth * 0.92 * direction, behavior: 'smooth' });
    }));
    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    updateButtons();
  });
}

function setupFilters() {
  const form = document.getElementById('filters');
  const grid = document.querySelector('.catalog-main [data-product-grid]');
  const sort = document.getElementById('catalogSort');
  const toggle = document.getElementById('filterToggle');
  if (!form || !grid) return;

  const applyFilters = () => {
    let items = currentCatalogItems();
    const selectedGroups = [...form.querySelectorAll('.filter-group')]
      .map(group => [...group.querySelectorAll('input:checked')].map(input => input.value.toLocaleLowerCase('pt-BR')))
      .filter(values => values.length);

    if (selectedGroups.length) {
      items = items.filter(product => {
        const searchable = `${product.name} ${product.category} ${product.format} ${product.material}`.toLocaleLowerCase('pt-BR');
        return selectedGroups.every(values => values.some(value => searchable.includes(value)));
      });
    }

    if (sort?.value === 'price-asc') items.sort((a, b) => a.price - b.price);
    if (sort?.value === 'price-desc') items.sort((a, b) => b.price - a.price);
    renderGrid(grid, items);
    document.getElementById('foundCount').textContent = items.length;
    document.getElementById('catalogEmpty').hidden = Boolean(items.length);
  };

  form.addEventListener('change', applyFilters);
  sort?.addEventListener('change', applyFilters);
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    form.classList.toggle('is-open', !expanded);
  });
  applyFilters();
}

function setupProductGallery(product) {
  const mainImage = document.getElementById('pdImage');
  if (!mainImage) return;
  mainImage.alt = product.name;
  const firstThumbnail = document.querySelector('[data-gallery-image]');
  if (firstThumbnail) {
    firstThumbnail.dataset.galleryImage = mainImage.getAttribute('src');
    const preview = firstThumbnail.querySelector('img');
    if (product.slug !== 'adesivo-redondo-personalizado' && preview) {
      preview.src = product.image;
      preview.alt = product.name;
    }
  }
  document.querySelectorAll('[data-gallery-image]').forEach((button, index) => {
    if (index === 0) button.classList.add('active');
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-gallery-image]').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      mainImage.src = button.dataset.galleryImage;
      mainImage.alt = button.querySelector('img')?.alt || product.name;
    });
  });
}

function renderProductPage() {
  const box = document.getElementById('productDetail');
  if (!box) return;
  const slug = new URLSearchParams(location.search).get('slug') || 'adesivo-redondo-personalizado';
  const product = findProduct(slug);

  if (!product) {
    box.innerHTML = '<div class="container empty-state"><h1>Produto não encontrado</h1><p>Volte ao catálogo para escolher outro item.</p><a class="btn btn-blue" href="catalogo.html">Ver catálogo</a></div>';
    return;
  }

  document.getElementById('pdName').textContent = product.name;
  document.getElementById('pdPrice').textContent = fmt(product.price);
  const image = document.getElementById('pdImage');
  image.src = product.slug === 'adesivo-redondo-personalizado' ? 'assets/img/product-main.png' : product.image;
  document.title = `${product.name} | Stick Adesivos`;
  setupProductGallery(product);

  document.querySelectorAll('.variant').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.variant').forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
  }));

  const qtyValue = document.getElementById('qtyValue');
  const setQuantity = value => {
    const quantity = Math.max(1, value);
    qtyValue.dataset.qty = quantity;
    qtyValue.textContent = `${quantity * 100} unidades`;
  };
  document.getElementById('qtyMinus')?.addEventListener('click', () => setQuantity(Number(qtyValue.dataset.qty || 1) - 1));
  document.getElementById('qtyPlus')?.addEventListener('click', () => setQuantity(Number(qtyValue.dataset.qty || 1) + 1));

  const artworkInput = document.getElementById('artworkInput');
  const artworkName = document.getElementById('artworkName');
  artworkInput?.addEventListener('change', () => {
    const file = artworkInput.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      artworkInput.value = '';
      artworkName.textContent = 'O arquivo deve ter no máximo 20 MB.';
      artworkName.classList.add('field-error');
      return;
    }
    artworkName.textContent = file.name;
    artworkName.classList.remove('field-error');
  });

  document.getElementById('shippingForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const cep = document.getElementById('shippingCep');
    if (!cep.checkValidity()) {
      cep.reportValidity();
      return;
    }
    showToast('O cálculo de frete será concluído pela loja integrada.');
  });

  document.getElementById('addProductBtn')?.addEventListener('click', () => {
    const quantity = Number(qtyValue.dataset.qty || 1);
    const variant = document.querySelector('.variant.active')?.dataset.variant || '5x5 cm';
    addToCart(product.slug, quantity, variant, artworkInput?.files?.[0]?.name || '');
  });
}

function renderCart() {
  const box = document.getElementById('cartRows');
  if (!box) return;
  const cart = getCart();
  if (!cart.length) {
    box.innerHTML = '<div class="empty-state"><h2>Seu carrinho está vazio</h2><p>Escolha um produto e volte aqui para revisar o pedido.</p><a class="btn btn-blue" href="catalogo.html">Ver produtos</a></div>';
    document.getElementById('cartSummary').hidden = true;
    document.getElementById('cartActions').hidden = true;
    return;
  }

  box.innerHTML = cart.map((item, index) => `
    <div class="cart-row">
      <div class="cart-prod"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}"><div><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.variant)} · ${escapeHTML(item.material)}${item.artworkName ? `<br>Arte: ${escapeHTML(item.artworkName)}` : '<br>Arte: enviar depois'}</small></div></div>
      <div class="cart-unit"><span class="mobile-label">Preço</span><strong>${fmt(item.price)}</strong></div>
      <div class="qty" aria-label="Quantidade de pacotes"><button type="button" data-cart-qty="${index}" data-delta="-1" aria-label="Diminuir quantidade">−</button><span>${item.qty}</span><button type="button" data-cart-qty="${index}" data-delta="1" aria-label="Aumentar quantidade">+</button></div>
      <div class="cart-sub"><span class="mobile-label">Subtotal</span>${fmt(item.price * item.qty)}</div>
      <button class="remove" type="button" data-cart-remove="${index}" aria-label="Remover ${escapeHTML(item.name)}">×</button>
    </div>`).join('');

  box.querySelectorAll('[data-cart-qty]').forEach(button => button.addEventListener('click', () => {
    const updatedCart = getCart();
    const index = Number(button.dataset.cartQty);
    updatedCart[index].qty = Math.max(1, updatedCart[index].qty + Number(button.dataset.delta));
    setCart(updatedCart);
    renderCart();
  }));
  box.querySelectorAll('[data-cart-remove]').forEach(button => button.addEventListener('click', () => {
    const updatedCart = getCart();
    updatedCart.splice(Number(button.dataset.cartRemove), 1);
    setCart(updatedCart);
    renderCart();
  }));
  updateCartSummary();
}

function updateCartSummary() {
  const totals = cartTotals();
  const subtotal = document.getElementById('sumSubtotal');
  const total = document.getElementById('sumTotal');
  if (subtotal) subtotal.textContent = fmt(totals.total);
  if (total) total.textContent = fmt(totals.total);
}

function setupCartActions() {
  document.getElementById('emptyCartButton')?.addEventListener('click', () => {
    setCart([]);
    renderCart();
    showToast('Carrinho esvaziado.');
  });
  document.getElementById('cartShippingButton')?.addEventListener('click', () => showToast('O frete será calculado no checkout.'));
  document.getElementById('helpButton')?.addEventListener('click', () => {
    location.href = 'contato.html?assunto=Ajuda%20com%20o%20pedido';
  });
}

function renderCheckout() {
  const box = document.getElementById('checkoutItems');
  if (!box) return;
  const cart = getCart();
  const totals = cartTotals();
  const shipping = 0;
  box.innerHTML = cart.length ? cart.map(item => `
    <div class="mini"><img src="${escapeHTML(item.image)}" alt=""><div><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.variant)} · ${escapeHTML(item.material)}<br>Qtd.: ${item.qty}</small></div><strong>${fmt(item.price * item.qty)}</strong></div>`).join('') : '<div class="empty-checkout"><p>Seu carrinho está vazio.</p><a href="catalogo.html">Voltar ao catálogo</a></div>';
  document.getElementById('checkoutCount').textContent = `${totals.count} item(ns)`;
  document.getElementById('checkoutSubtotal').textContent = fmt(totals.total);
  document.getElementById('checkoutShipping').textContent = cart.length ? 'A calcular' : fmt(0);
  document.getElementById('checkoutTotal').textContent = fmt(totals.total + shipping);
  const submit = document.getElementById('checkoutSubmit');
  if (submit) submit.disabled = !cart.length;
}

function setupCheckout() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    showToast('Checkout demonstrativo: o pedido será finalizado pela Nuvemshop.');
  });
}

function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const subject = new URLSearchParams(location.search).get('assunto');
  if (subject) form.elements.subject.value = subject;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    showToast('Formulário pronto para conexão com o canal oficial.');
  });
}

function setupNavigation() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const links = [...document.querySelectorAll('.nav a')];
  links.forEach(link => link.classList.remove('active'));
  if (currentPage === 'catalogo.html' || currentPage === 'produto.html') {
    document.querySelector('.nav [data-nav="catalogo"]')?.classList.add('active');
  } else {
    links.find(link => link.getAttribute('href') === currentPage)?.classList.add('active');
  }
  document.querySelectorAll('[data-current-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
  });
}

document.addEventListener('DOMContentLoaded', () => {
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
});

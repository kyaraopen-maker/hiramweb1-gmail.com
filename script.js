/* === DONNÉES INITIALES & STOCKAGE LOCAL === */
const DEFAULT_PRODUCTS = [
  {
    id: 101,
    name: "Infinix Note 30 Pro (8Go / 256Go) - Charge 68W",
    category: "Smartphones",
    badge: "Arrivage Chine",
    retailPrice: 145000,
    wholesalePrice: 132000,
    moq: 3,
    stock: 14,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80",
    description: "Écran AMOLED 120Hz, appareil photo 108MP, charge rapide 68W incluse dans la boîte. Neuf scellé avec garantie atelier."
  },
  {
    id: 102,
    name: "iPhone 13 Pro Max 256Go - Grade A+ Débloqué Tout Réseau",
    category: "Smartphones",
    badge: "Garantie 6 mois",
    retailPrice: 365000,
    wholesalePrice: 340000,
    moq: 2,
    stock: 6,
    image: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=600&q=80",
    description: "Batterie supérieure à 90%, Face ID 100% fonctionnel, zéro défaut esthétique. Testé via 3uTools dans notre atelier."
  },
  {
    id: 103,
    name: "Chargeur Rapide GaN 65W Double Port USB-C + USB-A",
    category: "Chargeurs & Câbles",
    badge: "Best-Seller",
    retailPrice: 8500,
    wholesalePrice: 5500,
    moq: 5,
    stock: 60,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80",
    description: "Compatible iPhone, Samsung Super Fast Charging, Infinix et ordinateurs portables USB-C. Protection contre les surtensions."
  },
  {
    id: 104,
    name: "Écouteurs Sans Fil AirPods Pro 2e Génération (ANC)",
    category: "Audio & Montres",
    badge: "Promo",
    retailPrice: 12000,
    wholesalePrice: 8000,
    moq: 5,
    stock: 45,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80",
    description: "Réduction active du bruit, boîtier de charge MagSafe, autonomie 5h par charge, son basse profonde."
  },
  {
    id: 105,
    name: "Montre Connectée Ultra 9 AMOLED + 2 Bracelets",
    category: "Audio & Montres",
    badge: "Arrivage Chine",
    retailPrice: 15000,
    wholesalePrice: 10500,
    moq: 4,
    stock: 32,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
    description: "Appels Bluetooth, notifications WhatsApp, suivi sportif, chargeur sans fil inclus. Compatible Android & iOS."
  },
  {
    id: 106,
    name: "Blender Mixeur Professionnel 2L Haute Puissance 4500W",
    category: "Électroménager",
    badge: "Best-Seller",
    retailPrice: 28000,
    wholesalePrice: 22500,
    moq: 3,
    stock: 18,
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80",
    description: "Bol incassable 2 litres, 6 lames en acier inoxydable, idéal pour jus naturels, glaçons, épices et usage intensif."
  },
  {
    id: 107,
    name: "Écran Complet Original LCD/OLED iPhone & Infinix (Toutes Séries)",
    category: "Réparation & Pièces",
    badge: "Atelier",
    retailPrice: 18000,
    wholesalePrice: 13500,
    moq: 3,
    stock: 40,
    image: "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?auto=format&fit=crop&w=600&q=80",
    description: "Afficheurs haute luminosité pour techniciens et particuliers. Pose gratuite disponible à la boutique de Mfilou."
  },
  {
    id: 108,
    name: "Power Bank 20 000 mAh Charge Rapide 22.5W avec Câbles Intégrés",
    category: "Chargeurs & Câbles",
    badge: "Arrivage Chine",
    retailPrice: 14000,
    wholesalePrice: 10000,
    moq: 4,
    stock: 25,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80",
    description: "Écran LED indiquant le pourcentage exact, charge jusqu'à 4 fois un smartphone complet. Indispensable en cas de coupure."
  }
];

let products = JSON.parse(localStorage.getItem('hiram_products')) || DEFAULT_PRODUCTS;
let cart = JSON.parse(localStorage.getItem('hiram_cart')) || [];
let orders = JSON.parse(localStorage.getItem('hiram_orders')) || [];
let storeSettings = JSON.parse(localStorage.getItem('hiram_settings')) || {
  whatsapp: "242060000000",
  pin: "1234",
  address: "90 rue Kingoué, quartier La Base, Mfilou, Brazzaville"
};

let activeCategory = 'all';
let isAdminUnlocked = false;
let uploadedImageDataUrl = "";

/* === FORMATAGE MONNAIE FCFA === */
function formatFCFA(amount) {
  return Number(amount).toLocaleString('fr-FR') + ' FCFA';
}

/* === INITIALISATION === */
document.addEventListener('DOMContentLoaded', () => {
  applyStoreSettingsToUI();
  renderProducts();
  updateCartUI();
});

function applyStoreSettingsToUI() {
  document.getElementById('topbarAddress').textContent = storeSettings.address;
  document.getElementById('heroAddressDisplay').textContent = storeSettings.address;
  document.getElementById('footerAddress').textContent = storeSettings.address;
  document.getElementById('footerPhone').textContent = '+' + storeSettings.whatsapp;
  document.getElementById('settingWhatsapp').value = storeSettings.whatsapp;
  document.getElementById('settingPin').value = storeSettings.pin;
  document.getElementById('settingAddress').value = storeSettings.address;
}

/* === AFFICHAGE & FILTRAGE DU CATALOGUE === */
function selectCategory(cat, btnElement) {
  activeCategory = cat;
  document.getElementById('searchCategorySelect').value = cat;

  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  } else {
    const target = document.querySelector(`.cat-pill[data-cat="${cat}"]`);
    if (target) target.classList.add('active');
  }

  document.getElementById('catalogTitle').textContent = cat === 'all' ? 'Catalogue Complet des Produits' : `Catégorie : ${cat}`;
  filterProducts();
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  selectCategory('all');
}

function filterProducts() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const selectCat = document.getElementById('searchCategorySelect').value;
  if (selectCat !== activeCategory) {
    activeCategory = selectCat;
    document.querySelectorAll('.cat-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.cat === activeCategory);
    });
  }

  const sortBy = document.getElementById('sortSelect').value;

  let filtered = products.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchQuery = p.name.toLowerCase().includes(query) ||
                       p.category.toLowerCase().includes(query) ||
                       (p.description && p.description.toLowerCase().includes(query));
    return matchCat && matchQuery;
  });

  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.retailPrice - b.retailPrice);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.retailPrice - a.retailPrice);
  } else if (sortBy === 'stock') {
    filtered.sort((a, b) => b.stock - a.stock);
  }

  renderProducts(filtered);
}

function renderProducts(list = products) {
  const grid = document.getElementById('productsGrid');
  document.getElementById('catalogCount').textContent = `${list.length} article(s) disponible(s)`;

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:48px 20px; background:#fff; border-radius:14px; border:1px solid var(--border);">
        <i class="fa-solid fa-box-open" style="font-size:2.5rem; color:#cbd5e1; margin-bottom:12px;"></i>
        <h3>Aucun article trouvé</h3>
        <p style="color:var(--text-muted); font-size:0.9rem; margin:6px 0 16px;">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
        <button class="btn-primary" onclick="resetFilters()">Afficher tout le catalogue</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(p => {
    const inStock = p.stock > 0;
    return `
      <article class="product-card">
        <div class="product-img-wrap" onclick="openProductDetail(${p.id})">
          <img src="${p.image || 'https://via.placeholder.com/400x300?text=Hiram+TECH'}" alt="${p.name}" loading="lazy">
          ${p.badge ? `<span class="badge-promo">${p.badge}</span>` : ''}
          <span class="badge-stock ${inStock ? '' : 'out'}">
            ${inStock ? `En stock (${p.stock})` : 'Rupture'}
          </span>
        </div>
        <div class="product-body">
          <span class="product-cat">${p.category}</span>
          <h3 class="product-title" onclick="openProductDetail(${p.id})">${p.name}</h3>

          <div class="price-tiers">
            <div class="tier-box">
              <span class="tier-label">1 pièce (Détail)</span>
              <span class="tier-price">${formatFCFA(p.retailPrice)}</span>
            </div>
            <div class="tier-box wholesale">
              <span class="tier-label">Dès ${p.moq} pcs (Gros)</span>
              <span class="tier-price">${formatFCFA(p.wholesalePrice)}</span>
            </div>
          </div>

          <div class="supplier-meta">
            <span class="verified-chip"><i class="fa-solid fa-circle-check"></i> Hiram TECH Vérifié</span>
            <span>Brazzaville</span>
          </div>

          <div class="product-actions">
            <button class="btn-add-cart" onclick="addToCart(${p.id})" ${!inStock ? 'disabled' : ''}>
              <i class="fa-solid fa-cart-plus"></i> ${inStock ? 'Ajouter au panier' : 'Indisponible'}
            </button>
            <button class="btn-wa-direct" title="Commander cet article sur WhatsApp" onclick="orderSingleWhatsApp(${p.id})">
              <i class="fa-brands fa-whatsapp"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

/* === MODAL DÉTAIL PRODUIT === */
function openProductDetail(id) {
  const p = products.find(item => item.id === id);
  if (!p) return;

  document.getElementById('detailModalTitle').textContent = p.category;
  document.getElementById('detailModalBody').innerHTML = `
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:22px; align-items:start;">
      <img src="${p.image}" alt="${p.name}" style="width:100%; border-radius:12px; border:1px solid var(--border); max-height:320px; object-fit:cover;">
      <div>
        ${p.badge ? `<span style="background:var(--primary-light); color:var(--primary); font-weight:800; font-size:0.75rem; padding:4px 10px; border-radius:6px;">${p.badge}</span>` : ''}
        <h2 style="font-size:1.25rem; color:var(--navy); margin:10px 0;">${p.name}</h2>
        <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:16px;">${p.description || 'Article disponible en boutique à Brazzaville.'}</p>

        <div class="price-tiers" style="margin-bottom:16px;">
          <div class="tier-box">
            <span class="tier-label">Prix Unitaire (1 à ${p.moq - 1} pcs)</span>
            <span class="tier-price" style="font-size:1.1rem;">${formatFCFA(p.retailPrice)}</span>
          </div>
          <div class="tier-box wholesale">
            <span class="tier-label">Prix Grossiste (≥ ${p.moq} pcs)</span>
            <span class="tier-price" style="font-size:1.1rem;">${formatFCFA(p.wholesalePrice)}</span>
          </div>
        </div>

        <div style="font-size:0.84rem; margin-bottom:18px; color:var(--text-main);">
          <div><i class="fa-solid fa-box" style="color:var(--primary); width:20px;"></i> Disponibilité : <strong>${p.stock} pièces en stock</strong></div>
          <div style="margin-top:5px;"><i class="fa-solid fa-location-dot" style="color:var(--primary); width:20px;"></i> Retrait : <strong>${storeSettings.address}</strong></div>
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn-primary" onclick="addToCart(${p.id}); closeDetailModal();" ${p.stock <= 0 ? 'disabled' : ''}>
            <i class="fa-solid fa-cart-plus"></i> Ajouter au panier
          </button>
          <button class="btn-primary" style="background:var(--navy);" onclick="addToCart(${p.id}, ${p.moq}); closeDetailModal();" ${p.stock < p.moq ? 'disabled' : ''}>
            <i class="fa-solid fa-boxes-stacked"></i> Prendre lot gros (${p.moq} pcs)
          </button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('productDetailModal').classList.add('open');
}

function closeDetailModal() {
  document.getElementById('productDetailModal').classList.remove('open');
}

/* === GESTION DU PANIER & CALCUL GROS AUTOMATIQUE === */
function addToCart(productId, qtyToAdd = 1) {
  const prod = products.find(p => p.id === productId);
  if (!prod || prod.stock <= 0) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    if (existing.qty + qtyToAdd <= prod.stock) {
      existing.qty += qtyToAdd;
    } else {
      showToast(`Stock maximum atteint (${prod.stock} pcs)`);
      return;
    }
  } else {
    cart.push({ id: productId, qty: Math.min(qtyToAdd, prod.stock) });
  }

  saveCart();
  updateCartUI();
  showToast(`"${prod.name.substring(0, 28)}..." ajouté au panier`);
}

function changeCartQty(productId, delta) {
  const idx = cart.findIndex(c => c.id === productId);
  if (idx === -1) return;

  const prod = products.find(p => p.id === productId);
  const newQty = cart[idx].qty + delta;

  if (newQty <= 0) {
    cart.splice(idx, 1);
  } else if (prod && newQty <= prod.stock) {
    cart[idx].qty = newQty;
  } else {
    showToast('Quantité maximale en stock atteinte');
  }

  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('hiram_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  document.getElementById('cartBadge').textContent = totalItems;
  document.getElementById('drawerCount').textContent = totalItems;

  const container = document.getElementById('cartItemsContainer');
  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:40px 15px; color:var(--text-muted);">
        <i class="fa-solid fa-cart-arrow-down" style="font-size:2.4rem; color:#cbd5e1; margin-bottom:10px;"></i>
        <p style="font-weight:600;">Votre panier est vide</p>
        <p style="font-size:0.82rem; margin-top:4px;">Ajoutez des téléphones ou accessoires pour commander.</p>
      </div>
    `;
    document.getElementById('cartSubtotal').textContent = '0 FCFA';
    document.getElementById('cartTotal').textContent = '0 FCFA';
    document.getElementById('wholesaleSavingsBanner').style.display = 'none';
    return;
  }

  let subtotal = 0;
  let hasWholesale = false;

  container.innerHTML = cart.map(item => {
    const prod = products.find(p => p.id === item.id);
    if (!prod) return '';

    const isWholesale = item.qty >= prod.moq;
    if (isWholesale) hasWholesale = true;
    const appliedPrice = isWholesale ? prod.wholesalePrice : prod.retailPrice;
    const lineTotal = appliedPrice * item.qty;
    subtotal += lineTotal;

    return `
      <div class="cart-item">
        <img src="${prod.image}" alt="${prod.name}">
        <div class="cart-item-info">
          <div class="cart-item-title">${prod.name}</div>
          <div class="cart-item-price">
            ${formatFCFA(appliedPrice)} / u
            ${isWholesale ? '<span class="wholesale-tag">Tarif Gros</span>' : `<span style="font-size:0.7rem; color:var(--text-muted); font-weight:500;">(Gros dès ${prod.moq})</span>`}
          </div>
          <div class="qty-controls">
            <button class="qty-btn" onclick="changeCartQty(${prod.id}, -1)">-</button>
            <strong style="font-size:0.86rem; min-width:20px; text-align:center;">${item.qty}</strong>
            <button class="qty-btn" onclick="changeCartQty(${prod.id}, 1)">+</button>
            <span style="margin-left:auto; font-weight:800; font-size:0.85rem; color:var(--navy);">${formatFCFA(lineTotal)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('wholesaleSavingsBanner').style.display = hasWholesale ? 'block' : 'none';
  document.getElementById('cartSubtotal').textContent = formatFCFA(subtotal);
  document.getElementById('cartTotal').textContent = formatFCFA(subtotal);
}

function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
}

/* === VALIDATION COMMANDE (SITE OU WHATSAPP) === */
function submitOrder(channel) {
  if (cart.length === 0) {
    showToast('Votre panier est vide !');
    return;
  }

  const custName = document.getElementById('custName').value.trim();
  const custPhone = document.getElementById('custPhone').value.trim();
  const custNeighborhood = document.getElementById('custNeighborhood').value;

  if (!custName || !custPhone) {
    showToast('Veuillez entrer votre nom et numéro de téléphone.');
    return;
  }

  let total = 0;
  const orderItems = cart.map(item => {
    const prod = products.find(p => p.id === item.id);
    const unitPrice = item.qty >= prod.moq ? prod.wholesalePrice : prod.retailPrice;
    total += unitPrice * item.qty;

    // Déduction du stock
    prod.stock = Math.max(0, prod.stock - item.qty);

    return {
      name: prod.name,
      qty: item.qty,
      unitPrice: unitPrice
    };
  });

  const newOrder = {
    id: 'CMD-' + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    customer: custName,
    phone: custPhone,
    neighborhood: custNeighborhood,
    items: orderItems,
    total: total,
    status: 'En attente'
  };

  orders.unshift(newOrder);
  localStorage.setItem('hiram_orders', JSON.stringify(orders));
  localStorage.setItem('hiram_products', JSON.stringify(products));

  // Vider le panier
  cart = [];
  saveCart();
  updateCartUI();
  renderProducts();
  closeCart();

  if (channel === 'whatsapp') {
    const lines = orderItems.map(i => `• ${i.qty}x ${i.name} (${formatFCFA(i.unitPrice * i.qty)})`).join('%0A');
    const msg = `Bonjour *Hiram TECH* !%0AJe souhaite confirmer ma commande *${newOrder.id}* :%0A%0A${lines}%0A%0A*Total : ${formatFCFA(total)}*%0A*Client :* ${custName} (${custPhone})%0A*Livraison :* ${custNeighborhood}`;
    window.open(`https://wa.me/${storeSettings.whatsapp}?text=${msg}`, '_blank');
  } else {
    showToast(`Commande ${newOrder.id} enregistrée ! Nous vous contactons rapidement.`);
  }
}

function orderSingleWhatsApp(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;
  const msg = `Bonjour *Hiram TECH* (Mfilou La Base), je suis intéressé par :%0A*${prod.name}*%0A- Prix Détail : ${formatFCFA(prod.retailPrice)}%0A- Prix Gros (dès ${prod.moq} pcs) : ${formatFCFA(prod.wholesalePrice)}%0AEst-il disponible ?`;
  window.open(`https://wa.me/${storeSettings.whatsapp}?text=${msg}`, '_blank');
}

function openQuickWhatsApp() {
  const msg = `Bonjour *Hiram TECH*, je vous contacte depuis votre boutique en ligne pour un renseignement / devis grossiste.`;
  window.open(`https://wa.me/${storeSettings.whatsapp}?text=${msg}`, '_blank');
}

/* === ESPACE ADMINISTRATEUR === */
function openAdminModal() {
  document.getElementById('adminModal').classList.add('open');
  if (isAdminUnlocked) {
    showAdminDashboard();
  } else {
    document.getElementById('adminLoginScreen').style.display = 'block';
    document.getElementById('adminDashboardScreen').style.display = 'none';
    document.getElementById('adminPinInput').value = '';
    document.getElementById('pinErrorMsg').style.display = 'none';
    setTimeout(() => document.getElementById('adminPinInput').focus(), 100);
  }
}

function closeAdminModal() {
  document.getElementById('adminModal').classList.remove('open');
}

function verifyAdminPin() {
  const entered = document.getElementById('adminPinInput').value.trim();
  if (entered === storeSettings.pin) {
    isAdminUnlocked = true;
    showAdminDashboard();
  } else {
    document.getElementById('pinErrorMsg').style.display = 'block';
  }
}

function showAdminDashboard() {
  document.getElementById('adminLoginScreen').style.display = 'none';
  document.getElementById('adminDashboardScreen').style.display = 'block';
  refreshAdminData();
}

function switchAdminTab(tabId, btn) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

function refreshAdminData() {
  // KPIs
  document.getElementById('kpiTotalProducts').textContent = products.length;
  document.getElementById('kpiTotalOrders').textContent = orders.length;

  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  document.getElementById('kpiRevenue').textContent = formatFCFA(revenue);

  const stockVal = products.reduce((sum, p) => sum + (p.wholesalePrice * p.stock), 0);
  document.getElementById('kpiStockValue').textContent = formatFCFA(stockVal);

  // Table Produits
  const tbody = document.getElementById('adminProductsTableBody');
  tbody.innerHTML = products.map(p => `
    <tr>
      <td style="display:flex; align-items:center; gap:10px;">
        <img src="${p.image}" class="tbl-thumb" alt="">
        <div>
          <strong style="display:block; color:var(--navy);">${p.name}</strong>
          <span style="font-size:0.74rem; color:var(--text-muted);">MOQ Gros : ${p.moq} pcs</span>
        </div>
      </td>
      <td>${p.category}</td>
      <td><strong>${formatFCFA(p.retailPrice)}</strong></td>
      <td style="color:var(--primary); font-weight:700;">${formatFCFA(p.wholesalePrice)}</td>
      <td>${p.stock} pcs</td>
      <td>
        <button class="tbl-btn edit" onclick="editProduct(${p.id})"><i class="fa-solid fa-pen"></i> Modifier</button>
        <button class="tbl-btn del" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('');

  // Table Commandes
  const ordersBody = document.getElementById('adminOrdersTableBody');
  if (orders.length === 0) {
    ordersBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:24px; color:var(--text-muted);">Aucune commande enregistrée pour le moment.</td></tr>`;
  } else {
    ordersBody.innerHTML = orders.map((o, index) => `
      <tr>
        <td><strong>${o.id}</strong><br><span style="font-size:0.74rem; color:var(--text-muted);">${o.date}</span></td>
        <td><strong>${o.customer}</strong> (${o.phone})<br><span style="font-size:0.76rem; color:var(--primary);">${o.neighborhood}</span></td>
        <td>${o.items.map(i => `${i.qty}x ${i.name}`).join('<br>')}</td>
        <td><strong>${formatFCFA(o.total)}</strong></td>
        <td>
          <select onchange="updateOrderStatus(${index}, this.value)" style="padding:5px 8px; border-radius:6px; border:1px solid var(--border); font-weight:700; font-size:0.78rem;">
            <option value="En attente" ${o.status === 'En attente' ? 'selected' : ''}>🟡 En attente</option>
            <option value="En livraison" ${o.status === 'En livraison' ? 'selected' : ''}>🚚 En livraison</option>
            <option value="Livré" ${o.status === 'Livré' ? 'selected' : ''}>🟢 Livré & Payé</option>
          </select>
        </td>
      </tr>
    `).join('');
  }
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedImageDataUrl = e.target.result;
    const prev = document.getElementById('prodImagePreview');
    prev.src = uploadedImageDataUrl;
    prev.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function saveProduct() {
  const editId = document.getElementById('editProductId').value;
  const name = document.getElementById('prodName').value.trim();
  const category = document.getElementById('prodCategory').value;
  const badge = document.getElementById('prodBadge').value;
  const retailPrice = parseInt(document.getElementById('prodRetailPrice').value, 10);
  const wholesalePrice = parseInt(document.getElementById('prodWholesalePrice').value, 10);
  const moq = parseInt(document.getElementById('prodMoq').value, 10) || 3;
  const stock = parseInt(document.getElementById('prodStock').value, 10) || 0;
  const imageUrlInput = document.getElementById('prodImageUrl').value.trim();
  const desc = document.getElementById('prodDesc').value.trim();

  if (!name || isNaN(retailPrice) || isNaN(wholesalePrice)) {
    showToast('Veuillez remplir le nom, le prix détail et le prix gros.');
    return;
  }

  const finalImage = uploadedImageDataUrl || imageUrlInput || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80";

  if (editId) {
    const idx = products.findIndex(p => p.id === parseInt(editId, 10));
    if (idx !== -1) {
      products[idx] = {
        ...products[idx],
        name, category, badge, retailPrice, wholesalePrice, moq, stock,
        image: finalImage,
        description: desc
      };
      showToast('Article mis à jour avec succès !');
    }
  } else {
    const newProd = {
      id: Date.now(),
      name, category, badge, retailPrice, wholesalePrice, moq, stock,
      image: finalImage,
      description: desc
    };
    products.unshift(newProd);
    showToast('Nouvel article ajouté à la boutique !');
  }

  localStorage.setItem('hiram_products', JSON.stringify(products));
  resetProductForm();
  refreshAdminData();
  renderProducts();
}

function editProduct(id) {
  const p = products.find(item => item.id === id);
  if (!p) return;

  document.getElementById('editProductId').value = p.id;
  document.getElementById('prodName').value = p.name;
  document.getElementById('prodCategory').value = p.category;
  document.getElementById('prodBadge').value = p.badge || '';
  document.getElementById('prodRetailPrice').value = p.retailPrice;
  document.getElementById('prodWholesalePrice').value = p.wholesalePrice;
  document.getElementById('prodMoq').value = p.moq;
  document.getElementById('prodStock').value = p.stock;
  document.getElementById('prodImageUrl').value = p.image;
  document.getElementById('prodDesc').value = p.description || '';
  uploadedImageDataUrl = p.image;

  const prev = document.getElementById('prodImagePreview');
  prev.src = p.image;
  prev.style.display = 'block';

  document.getElementById('productFormTitle').innerHTML = `<i class="fa-solid fa-pen" style="color:var(--primary)"></i> Modifier l'article`;
  document.getElementById('saveProductBtnText').textContent = 'Enregistrer les modifications';
  document.getElementById('cancelEditBtn').style.display = 'inline-flex';

  document.querySelector('#adminModal .modal-body').scrollTo({ top: 0, behavior: 'smooth' });
}

function resetProductForm() {
  document.getElementById('editProductId').value = '';
  document.getElementById('prodName').value = '';
  document.getElementById('prodRetailPrice').value = '';
  document.getElementById('prodWholesalePrice').value = '';
  document.getElementById('prodMoq').value = '3';
  document.getElementById('prodStock').value = '20';
  document.getElementById('prodImageUrl').value = '';
  document.getElementById('prodImageFile').value = '';
  document.getElementById('prodDesc').value = '';
  uploadedImageDataUrl = '';
  document.getElementById('prodImagePreview').style.display = 'none';

  document.getElementById('productFormTitle').innerHTML = `<i class="fa-solid fa-plus-circle" style="color:var(--primary)"></i> Ajouter un nouvel article`;
  document.getElementById('saveProductBtnText').textContent = "Publier l'article";
  document.getElementById('cancelEditBtn').style.display = 'none';
}

function deleteProduct(id) {
  if (!confirm('Voulez-vous vraiment supprimer cet article de votre boutique ?')) return;
  products = products.filter(p => p.id !== id);
  localStorage.setItem('hiram_products', JSON.stringify(products));
  refreshAdminData();
  renderProducts();
  showToast('Article supprimé.');
}

function updateOrderStatus(index, newStatus) {
  orders[index].status = newStatus;
  localStorage.setItem('hiram_orders', JSON.stringify(orders));
  showToast(`Statut de commande mis à jour : ${newStatus}`);
}

function saveStoreSettings() {
  const wa = document.getElementById('settingWhatsapp').value.replace(/\D/g, '');
  const pin = document.getElementById('settingPin').value.trim();
  const addr = document.getElementById('settingAddress').value.trim();

  if (wa) storeSettings.whatsapp = wa;
  if (pin.length >= 4) storeSettings.pin = pin;
  if (addr) storeSettings.address = addr;

  localStorage.setItem('hiram_settings', JSON.stringify(storeSettings));
  applyStoreSettingsToUI();
  showToast('Paramètres de la boutique enregistrés !');
}

/* === EXPORT / IMPORT JSON === */
function exportCatalogJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ products, storeSettings }, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `hiram-tech-catalogue-${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  dlAnchor.remove();
  showToast('Catalogue exporté en fichier JSON !');
}

function importCatalogJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed.products)) {
        products = parsed.products;
        localStorage.setItem('hiram_products', JSON.stringify(products));
        if (parsed.storeSettings) {
          storeSettings = parsed.storeSettings;
          localStorage.setItem('hiram_settings', JSON.stringify(storeSettings));
          applyStoreSettingsToUI();
        }
        refreshAdminData();
        renderProducts();
        showToast('Catalogue importé avec succès !');
      } else {
        showToast('Format de fichier JSON invalide.');
      }
    } catch (err) {
      showToast('Erreur lors de la lecture du fichier JSON.');
    }
  };
  reader.readAsText(file);
}

function resetDemoData() {
  if (!confirm('Restaurer les articles de démonstration initiaux ?')) return;
  products = [...DEFAULT_PRODUCTS];
  localStorage.setItem('hiram_products', JSON.stringify(products));
  refreshAdminData();
  renderProducts();
  showToast('Catalogue démo restauré.');
}

/* === NOTIFICATION TOAST === */
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toastBox');
  document.getElementById('toastMessage').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
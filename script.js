// Craft Zen storefront: product search, filters, wishlist, shopping bag and WhatsApp order.
// Replace the placeholder below with your WhatsApp number including country code, no + or spaces.
const WHATSAPP_NUMBER = '01884047422';
const products = [
 {name:'Chocolate Bouquet',price:1250,image:'assets/chocolate-bouquet.jpg'},
 {name:'Ferrero Rocher Bouquet',price:1700,image:'assets/ferrero-rocher-bouquet.jpg'},
 {name:'Single Polaroids',price:null,image:'assets/single-polaroids.jpg'},
 {name:'Polaroids Bouquet',price:1350,image:'assets/polaroids-bouquet.jpg'},
 {name:'Gift Basket',price:2000,image:'assets/gift-basket.jpg'},
 {name:'Gift Box',price:null,image:'assets/gift-box.jpg'},
 {name:'Snacks Box',price:null,image:'assets/snacks-box.jpg'},
 {name:'Birthday Hamper',price:null,image:'assets/birthday-hamper.jpg'},
 {name:'Gift Packet',price:null,image:'assets/gift-packet.jpg'}
];
let cart = [];
let wishlist = new Set();
let toastTimer;
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const toast = (message)=>{const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400)};
const money = n => '৳ '+Number(n).toLocaleString('en-BD');
function openWhatsApp(message){if(WHATSAPP_NUMBER.includes('X')){toast('Please add your WhatsApp number in script.js first.');return;}window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,'_blank','noopener');}
function setCount(){ $('#cartCount').textContent=cart.reduce((s,p)=>s+p.qty,0);$('#wishCount').textContent=wishlist.size; }
function showCart(){ $('#cartPanel').classList.add('open');$('#overlay').classList.add('show');renderCart(); }
function hideCart(){ $('#cartPanel').classList.remove('open');$('#overlay').classList.remove('show'); }
function renderCart(){const root=$('#cartItems');if(!cart.length){root.innerHTML='<p class="cart-empty">Your bag is waiting for something lovely. ♡</p>';}else{root.innerHTML=cart.map((p,i)=>`<div class="cart-row"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><p>${p.price===null?'Inbox for price':money(p.price)}</p><div class="qty-controls"><button data-qty="-1" data-index="${i}" aria-label="Decrease quantity">−</button><span>${p.qty}</span><button data-qty="1" data-index="${i}" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${i}" aria-label="Remove item">×</button></div>`).join('');}const total=cart.reduce((s,p)=>s+(p.price||0)*p.qty,0);$('#cartTotal').textContent=money(total);}
function addToCart(name){const product=products.find(p=>p.name===name);if(!product)return;if(product.price===null){openWhatsApp(`Hello Craft Zen! I'd like to ask the price for ${product.name}.`);return;}const existing=cart.find(p=>p.name===name);if(existing)existing.qty++;else cart.push({...product,qty:1});setCount();renderCart();toast(`${name} added to your gift bag ♡`);}
$$('.add-btn').forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('.product-card');if(btn.classList.contains('inbox-btn')){openWhatsApp(`Hello Craft Zen! I'd like to know the price of ${card.dataset.name}.`);}else addToCart(card.dataset.name);}));
$$('.feature-order').forEach(btn=>btn.addEventListener('click',()=>{const name=btn.dataset.product;const p=products.find(x=>x.name===name);if(p?.price===null){openWhatsApp(`Hello Craft Zen! I'd like to know the price of ${name}.`);}else addToCart(name);}));
$$('.heart-btn').forEach(btn=>btn.addEventListener('click',()=>{const name=btn.closest('.product-card').dataset.name;if(wishlist.has(name)){wishlist.delete(name);btn.classList.remove('selected');btn.textContent='♡';toast('Removed from wishlist');}else{wishlist.add(name);btn.classList.add('selected');btn.textContent='♥';toast('Saved to your wishlist ♡');}setCount();}));
$('#searchInput').addEventListener('input',filterProducts);
let activeCategory='all';
function filterProducts(){const q=$('#searchInput').value.trim().toLowerCase();let visible=0;$$('.product-card').forEach(card=>{const matchText=(card.dataset.name+' '+card.dataset.category).toLowerCase().includes(q);const matchCat=activeCategory==='all'||card.dataset.category.split(' ').includes(activeCategory)||(activeCategory==='bouquet'&&card.dataset.category.includes('bouquet'));const show=matchText&&matchCat;card.hidden=!show;if(show)visible++;});$('#emptyState').hidden=visible!==0;}
$$('[data-category]').forEach(link=>link.addEventListener('click',()=>{activeCategory=link.dataset.category;filterProducts();}));
$('#viewAll').addEventListener('click',()=>{activeCategory='all';$('#searchInput').value='';filterProducts();toast('Showing all gifts ♡');});
$('#cartNav').addEventListener('click',showCart);$('#closeCart').addEventListener('click',hideCart);$('#overlay').addEventListener('click',hideCart);
$('#cartItems').addEventListener('click',e=>{const qty=e.target.closest('[data-qty]');const remove=e.target.closest('[data-remove]');if(qty){const i=Number(qty.dataset.index);cart[i].qty+=Number(qty.dataset.qty);if(cart[i].qty<=0)cart.splice(i,1);setCount();renderCart();}if(remove){cart.splice(Number(remove.dataset.remove),1);setCount();renderCart();}});
$('#checkoutBtn').addEventListener('click',()=>{if(!cart.length){toast('Add a gift to your bag first ♡');return;}const lines=cart.map(p=>`• ${p.name} × ${p.qty} — ${p.price===null?'Please confirm price':money(p.price*p.qty)}`).join('\n');const total=cart.reduce((s,p)=>s+(p.price||0)*p.qty,0);openWhatsApp(`Hello Craft Zen! I'd like to order:\n${lines}\n\nEstimated total (items with listed prices): ${money(total)}\nPlease confirm availability and delivery details.`);});
$('#orderForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const msg=`Hello Craft Zen! I'd like to place an order.\nName: ${f.get('name')}\nMy WhatsApp: ${f.get('phone')}\nGift: ${f.get('product')}\nDetails: ${f.get('details')||'Please contact me to discuss.'}\nPlease confirm price and delivery.`;openWhatsApp(msg);});
$('#wishlistNav').addEventListener('click',()=>{if(!wishlist.size){toast('Your wishlist is empty for now ♡');return;}const names=[...wishlist].join(', ');toast('Wishlist: '+names);});
$('#menuToggle').addEventListener('click',()=>$('#mainNav').classList.toggle('open'));
$$('#mainNav a').forEach(a=>a.addEventListener('click',()=>$('#mainNav').classList.remove('open')));
setCount();

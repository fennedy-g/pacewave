// Admin Dashboard Functionality
let adminData = {
  books: [],
  categories: [],
  homepage: { featured: [], new: [] }
};

// Load data from localStorage on init
window.addEventListener('DOMContentLoaded', () => {
  loadAdminData();
  renderDashboard();
  renderBooks();
  renderCategories();
  renderHomepage();
  injectModalStyles();
});

// Load admin data from localStorage
function loadAdminData() {
  const saved = localStorage.getItem('pacewave_admin');
  if (saved) {
    try {
      adminData = JSON.parse(saved);
    } catch (e) {
      console.error('Error loading admin data:', e);
      initializeDefaultData();
    }
  } else {
    initializeDefaultData();
  }
}

// Initialize with default data if none exists
function initializeDefaultData() {
  adminData = {
    books: [
      {id:1,title:"Atomic Habits",author:"James Clear",cat:"Self-Help",rating:4.8,cover:"https://picsum.photos/seed/a1/300/400",content:"Habits are the compound interest of self-improvement.",file:""},
      {id:2,title:"Project Hail Mary",author:"Andy Weir",cat:"Science",rating:4.9,cover:"https://picsum.photos/seed/a2/300/400",content:"Space exploration meets survival.",file:""},
      {id:3,title:"The Silent Patient",author:"Alex Michaelides",cat:"Mystery",rating:4.6,cover:"https://picsum.photos/seed/a3/300/400",content:"A psychological thriller.",file:""},
      {id:4,title:"Deep Work",author:"Cal Newport",cat:"Business",rating:4.7,cover:"https://picsum.photos/seed/a4/300/400",content:"Focus in a distracted world.",file:""},
      {id:5,title:"Sapiens",author:"Yuval Noah Harari",cat:"History",rating:4.9,cover:"https://picsum.photos/seed/a5/300/400",content:"A brief history of humankind.",file:""},
      {id:6,title:"Educated",author:"Tara Westover",cat:"Education",rating:4.8,cover:"https://picsum.photos/seed/a6/300/400",content:"A memoir of learning.",file:""},
      {id:7,title:"The Love Hypothesis",author:"Ali Hazelwood",cat:"Romance",rating:4.5,cover:"https://picsum.photos/seed/a7/300/400",content:"Fake dating turns real.",file:""},
      {id:8,title:"Dune",author:"Frank Herbert",cat:"Fiction",rating:4.9,cover:"https://picsum.photos/seed/a8/300/400",content:"Epic science fiction.",file:""}
    ],
    categories: ["Fiction","Romance","Mystery","Science","Business","Self-Help","History","Education"],
    homepage: { featured: [1,2,3,4,5], new: [3,4,5,6,7,8] }
  };
  saveAdminData();
}

// Save admin data to localStorage
function saveAdminData() {
  localStorage.setItem('pacewave_admin', JSON.stringify(adminData));
}

// Navigate to admin page
function goToAdmin() {
  window.location.href = 'admin.html';
}

// Render Dashboard
function renderDashboard() {
  const dashboard = document.getElementById('dashboard');
  if (!dashboard) return;
  
  const totalBooks = adminData.books.length;
  const totalCats = adminData.categories.length;
  const totalViews = adminData.books.reduce((sum, b) => sum + (b.views || 0), 0);
  
  document.getElementById('kpiBooks').innerText = totalBooks;
  document.getElementById('kpiCats').innerText = totalCats;
  document.getElementById('kpiViews').innerText = totalViews;
  
  const tbody = document.querySelector('#recentTable tbody');
  if (tbody) {
    tbody.innerHTML = adminData.books.slice(0, 5).map(b => `
      <tr>
        <td><img src="${b.cover}" style="width:32px;height:44px;border-radius:4px;object-fit:cover;"></td>
        <td>${b.title}</td>
        <td>${b.author}</td>
        <td>${b.views || 0}</td>
      </tr>
    `).join('');
  }
}

// Render Books Table
function renderBooks() {
  const tbody = document.querySelector('#booksTable tbody');
  if (!tbody) return;
  
  tbody.innerHTML = adminData.books.map(b => `
    <tr>
      <td><img src="${b.cover}" style="width:32px;height:44px;border-radius:4px;object-fit:cover;"></td>
      <td>${b.title}</td>
      <td>${b.author}</td>
      <td>${b.cat}</td>
      <td>
        <button class="btn-ghost" onclick="editBook(${b.id})" style="padding:4px 8px;font-size:0.85rem">Edit</button>
        <button class="btn-ghost" onclick="deleteBook(${b.id})" style="padding:4px 8px;font-size:0.85rem;color:#ef4444">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Render Categories Table
function renderCategories() {
  const tbody = document.querySelector('#catsTable tbody');
  if (!tbody) return;
  
  tbody.innerHTML = adminData.categories.map(cat => `
    <tr>
      <td>${cat}</td>
      <td>
        <button class="btn-ghost" onclick="editCat('${cat}')" style="padding:4px 8px;font-size:0.85rem">Edit</button>
        <button class="btn-ghost" onclick="deleteCat('${cat}')" style="padding:4px 8px;font-size:0.85rem;color:#ef4444">Delete</button>
      </td>
    </tr>
  `).join('');
}

// Render Homepage Configuration
function renderHomepage() {
  const featured = document.getElementById('featuredPick');
  const newArrivals = document.getElementById('newPick');
  if (!featured || !newArrivals) return;
  
  featured.innerHTML = adminData.books.map(b => `
    <label style="display:flex;align-items:center;gap:8px;margin:8px 0;cursor:pointer">
      <input type="checkbox" ${adminData.homepage.featured.includes(b.id) ? 'checked' : ''} onchange="toggleFeatured(${b.id})">
      <span>${b.title}</span>
    </label>
  `).join('');
  
  newArrivals.innerHTML = adminData.books.map(b => `
    <label style="display:flex;align-items:center;gap:8px;margin:8px 0;cursor:pointer">
      <input type="checkbox" ${adminData.homepage.new.includes(b.id) ? 'checked' : ''} onchange="toggleNew(${b.id})">
      <span>${b.title}</span>
    </label>
  `).join('');
}

// Tab Navigation
function showTab(tab, el) {
  document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
  document.getElementById(tab).classList.remove('hidden');
  document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
  if (el) el.classList.add('active');
}

function hpTab(tab, el) {
  document.getElementById('hp-featured').classList.toggle('hidden', tab !== 'featured');
  document.getElementById('hp-new').classList.toggle('hidden', tab !== 'new');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// Modal Functions
function openBookModal() {
  document.getElementById('bookId').value = '';
  document.getElementById('bookModalTitle').innerText = 'Add Book';
  document.getElementById('bTitle').value = '';
  document.getElementById('bAuthor').value = '';
  document.getElementById('bCoverUrl').value = '';
  document.getElementById('bRating').value = '';
  document.getElementById('bContent').value = '';
  document.getElementById('bFile').value = '';
  populateCategorySelect();
  document.getElementById('bookModal').classList.add('show');
}

function editBook(id) {
  const book = adminData.books.find(b => b.id === id);
  if (!book) return;
  document.getElementById('bookId').value = id;
  document.getElementById('bookModalTitle').innerText = 'Edit Book';
  document.getElementById('bTitle').value = book.title;
  document.getElementById('bAuthor').value = book.author;
  document.getElementById('bCoverUrl').value = book.cover;
  document.getElementById('bRating').value = book.rating;
  document.getElementById('bContent').value = book.content;
  document.getElementById('bFile').value = '';
  populateCategorySelect(book.cat);
  document.getElementById('bookModal').classList.add('show');
}

function saveBook() {
  const id = document.getElementById('bookId').value;
  const title = document.getElementById('bTitle').value;
  const author = document.getElementById('bAuthor').value;
  const cat = document.getElementById('bCat').value;
  const rating = parseFloat(document.getElementById('bRating').value) || 0;
  const cover = document.getElementById('bCoverUrl').value;
  const content = document.getElementById('bContent').value;
  const fileInput = document.getElementById('bFile');
  
  if (!title || !author || !cat) {
    alert('Please fill in all required fields (Title, Author, Category)');
    return;
  }
  
  const processBook = (fileUrl) => {
    if (id) {
      const book = adminData.books.find(b => b.id === parseInt(id));
      if (book) {
        book.title = title;
        book.author = author;
        book.cat = cat;
        book.rating = rating;
        book.cover = cover || book.cover;
        book.content = content;
        if (fileUrl) book.file = fileUrl;
      }
    } else {
      const newId = Math.max(...adminData.books.map(b => b.id), 0) + 1;
      adminData.books.push({
        id: newId,
        title,
        author,
        cat,
        rating,
        cover: cover || 'https://picsum.photos/300/400',
        content,
        file: fileUrl || ''
      });
    }
    
    saveAdminData();
    renderBooks();
    renderHomepage();
    renderDashboard();
    closeModal('bookModal');
  };
  
  if (fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = (e) => {
      processBook(e.target.result);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    processBook('');
  }
}

function deleteBook(id) {
  if (confirm('Delete this book?')) {
    adminData.books = adminData.books.filter(b => b.id !== id);
    adminData.homepage.featured = adminData.homepage.featured.filter(bid => bid !== id);
    adminData.homepage.new = adminData.homepage.new.filter(bid => bid !== id);
    saveAdminData();
    renderBooks();
    renderDashboard();
    renderHomepage();
  }
}

function openCatModal() {
  document.getElementById('catName').value = '';
  document.getElementById('catModal').classList.add('show');
}

function editCat(name) {
  document.getElementById('catName').value = name;
  document.getElementById('catModal').classList.add('show');
}

function saveCat() {
  const name = document.getElementById('catName').value.trim();
  if (!name) { 
    alert('Category name required'); 
    return; 
  }
  
  if (!adminData.categories.includes(name)) {
    adminData.categories.push(name);
    saveAdminData();
    renderCategories();
    renderBooks();
  } else {
    alert('Category already exists');
  }
  closeModal('catModal');
}

function deleteCat(name) {
  if (confirm('Delete this category?')) {
    adminData.categories = adminData.categories.filter(c => c !== name);
    saveAdminData();
    renderCategories();
  }
}

function toggleFeatured(id) {
  const idx = adminData.homepage.featured.indexOf(id);
  if (idx > -1) adminData.homepage.featured.splice(idx, 1);
  else adminData.homepage.featured.push(id);
}

function toggleNew(id) {
  const idx = adminData.homepage.new.indexOf(id);
  if (idx > -1) adminData.homepage.new.splice(idx, 1);
  else adminData.homepage.new.push(id);
}

function saveHomepage() {
  saveAdminData();
  alert('Homepage saved!');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('show');
}

function populateCategorySelect(selected = '') {
  const select = document.getElementById('bCat');
  if (!select) return;
  select.innerHTML = adminData.categories.map(c => `
    <option value="${c}" ${c === selected ? 'selected' : ''}>${c}</option>
  `).join('');
}

function exportData() {
  const dataStr = JSON.stringify(adminData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pacewave-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported.books && imported.categories) {
        adminData = imported;
        saveAdminData();
        alert('Data imported successfully!');
        location.reload();
      } else {
        alert('Invalid data format');
      }
    } catch (err) {
      alert('Error importing data: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// Inject modal styles
function injectModalStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .hidden { display: none !important; }
    .modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; align-items: center; justify-content: center; }
    .modal.show { display: flex !important; }
    .modal-box { background: var(--card); padding: 24px; border-radius: 16px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto; }
    .modal-box h3 { margin-bottom: 16px; }
    .modal-box label { display: block; margin: 12px 0 6px; font-weight: 600; }
    .modal-box input, .modal-box textarea, .modal-box select { width: 100%; padding: 10px; margin-bottom: 12px; border: 1px solid var(--border); background: var(--bg-elev); color: var(--text); border-radius: 8px; box-sizing: border-box; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    table th, table td { padding: 12px; border-bottom: 1px solid var(--border); text-align: left; }
    table th { background: var(--bg-elev); font-weight: 600; }
    table img { border-radius: 4px; }
    .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  `;
  document.head.appendChild(style);
}

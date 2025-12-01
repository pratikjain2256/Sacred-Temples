import './style.css'
import { templesData, galleryImages } from './temples-data.js'

let currentFilter = 'all';
let searchTerm = '';
let filteredTemples = [...templesData];

function initializeApp() {
  renderTempleList();
  renderGallery();
  setupEventListeners();
  setupSmoothScrolling();
}

function setupEventListeners() {
  const searchInput = document.getElementById('templeSearch');
  const filterButtons = document.querySelectorAll('.filter-btn');

  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    filterAndRenderTemples();
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.religion;
      filterAndRenderTemples();
    });
  });
}

function filterAndRenderTemples() {
  filteredTemples = templesData.filter(temple => {
    const matchesFilter = currentFilter === 'all' || temple.religion === currentFilter;
    const matchesSearch = temple.name.toLowerCase().includes(searchTerm) ||
                          temple.state.toLowerCase().includes(searchTerm) ||
                          temple.religion.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  renderTempleList();
}

function renderTempleList() {
  const templeList = document.getElementById('templeList');
  const templeDetail = document.getElementById('templeDetail');

  templeDetail.style.display = 'none';

  if (filteredTemples.length === 0) {
    templeList.innerHTML = '<p class="no-results">No temples found. Try different search terms.</p>';
    return;
  }

  templeList.innerHTML = filteredTemples.map(temple => `
    <div class="temple-card" data-id="${temple.id}">
      <img src="${temple.image}" alt="${temple.name}" class="temple-card-image">
      <div class="temple-card-content">
        <span class="religion-badge ${temple.religion}">${temple.religion}</span>
        <h3 class="temple-card-title">${temple.name}</h3>
        <p class="temple-card-location">${temple.state}</p>
        <p class="temple-card-description">${temple.description}</p>
        <button class="view-details-btn" data-id="${temple.id}">View Details</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const templeId = parseInt(e.target.dataset.id);
      showTempleDetails(templeId);
    });
  });
}

function showTempleDetails(templeId) {
  const temple = templesData.find(t => t.id === templeId);
  if (!temple) return;

  const templeList = document.getElementById('templeList');
  const templeDetail = document.getElementById('templeDetail');

  templeList.style.display = 'none';
  templeDetail.style.display = 'block';

  const mapsUrl = `https://www.google.com/maps?q=${temple.coordinates.lat},${temple.coordinates.lng}`;

  templeDetail.innerHTML = `
    <button class="back-btn" id="backToList">← Back to List</button>
    <div class="temple-detail-content">
      <div class="temple-detail-header">
        <img src="${temple.image}" alt="${temple.name}" class="temple-detail-image">
        <div class="temple-detail-info">
          <span class="religion-badge ${temple.religion}">${temple.religion}</span>
          <h2 class="temple-detail-title">${temple.name}</h2>
          <p class="temple-detail-location">${temple.location}</p>
          <p class="temple-detail-description">${temple.description}</p>
        </div>
      </div>

      <div class="temple-detail-section">
        <h3>History</h3>
        <p>${temple.history}</p>
      </div>

      <div class="temple-detail-section">
        <h3>Location</h3>
        <div class="location-info">
          <p><strong>Address:</strong> ${temple.location}</p>
          <a href="${mapsUrl}" target="_blank" class="maps-link">View on Google Maps →</a>
        </div>
      </div>

      <div class="temple-detail-section">
        <h3>Contact Information</h3>
        <div class="contact-info-detail">
          <p><strong>Phone:</strong> ${temple.contact.phone}</p>
          <p><strong>Email:</strong> ${temple.contact.email}</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('backToList').addEventListener('click', () => {
    templeDetail.style.display = 'none';
    templeList.style.display = 'grid';
  });

  updateMapSection(temple);

  templeDetail.scrollIntoView({ behavior: 'smooth' });
}

function updateMapSection(temple) {
  const mapContainer = document.getElementById('mapContainer');
  const mapsUrl = `https://www.google.com/maps?q=${temple.coordinates.lat},${temple.coordinates.lng}`;

  mapContainer.innerHTML = `
    <div class="map-info">
      <h3>${temple.name}</h3>
      <p>${temple.location}</p>
      <a href="${mapsUrl}" target="_blank" class="maps-btn">Open in Google Maps</a>
    </div>
    <iframe
      src="https://maps.google.com/maps?q=${temple.coordinates.lat},${temple.coordinates.lng}&t=&z=13&ie=UTF8&iwloc=&output=embed"
      width="100%"
      height="450"
      style="border:0;"
      allowfullscreen=""
      loading="lazy">
    </iframe>
  `;
}

function renderGallery() {
  const galleryGrid = document.querySelector('.gallery-grid');

  galleryGrid.innerHTML = galleryImages.map(img => `
    <div class="gallery-item">
      <img src="${img.src}" alt="${img.alt}" class="gallery-image">
      <div class="gallery-overlay">
        <p class="gallery-title">${img.title}</p>
      </div>
    </div>
  `).join('');
}

function setupSmoothScrolling() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initializeApp);

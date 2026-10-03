document.getElementById('currentYear').textContent = new Date().getFullYear();

// Pet directory with prices in Indian Rupees (₹)
const petDirectory = [
  {
    id: 'pet-1',
    name: 'Barnaby',
    species: 'Dog',
    breed: 'Golden Retriever',
    price: 1500,
    age: '1 year 2 months',
    character: ['Playful', 'Affectionate', 'Child-Friendly', 'Energetic'],
    image: 'barnaby.jpg.png',
    description: 'Barnaby is a sunshine boy who loves fetch, outdoor morning walks, and snuggling on rugs.'
  },
  {
    id: 'pet-2',
    name: 'Mochi',
    species: 'Cat',
    breed: 'Domestic Shorthair Mix',
    price: 1000,
    age: '8 months',
    character: ['Gentle', 'Calm', 'Indoor Lover', 'Lap Cat'],
    image: 'mochi.jpg.png',
    description: 'Mochi is a sweet purring friend who adores window perches and soft chin scratches.'
  },
  {
    id: 'pet-3',
    name: 'Rio & Sky',
    species: 'Birds',
    breed: 'Budgerigar Pair',
    price: 800,
    age: '6 months',
    character: ['Chirpy', 'Social', 'Vibrant', 'Melodic'],
    image: 'rio sky.jpg.png',
    description: 'Bonded pair of musical budgies looking for a sunny living space with regular daily flight time.'
  },
  {
    id: 'pet-4',
    name: 'Clover',
    species: 'Rabbit',
    breed: 'Dwarf Lop Mix',
    price: 1200,
    age: '10 months',
    character: ['Curious', 'Docile', 'Litter-Trained', 'Gentle'],
    image: 'drawft.jpg.png',
    description: 'Clover has velvety ears, enjoys fresh greens, and does delightful happy binkies.'
  },
  {
    id: 'pet-5',
    name: 'Aero & Coral',
    species: 'Fishe',
    breed: 'Freshwater Community Set',
    price: 350,
    age: '4 months',
    character: ['Peaceful', 'Mesmerizing', 'Low Maintenance', 'Hardy'],
    image: 'areal.jpg.png',
    description: 'Healthy community tank group with balanced temperament, includes care starter guide.'
  },
  {
    id: 'pet-6',
    name: 'Shelldon',
    species: 'Turtles',
    breed: 'Exotic Red-Eared Slider',
    price: 1500,
    age: '3 years',
    character: ['Calm', 'Basking Fan', 'Inquisitive', 'Quiet'],
    image: 'turtle.jpg.png',
    description: 'Shelldon is robust, loves UVB basking on flat rocks, and responds eagerly for leafy greens.'
  },
  {
    id: 'pet-7',
    name: 'Peanut',
    species: 'Hamsters',
    breed: 'Syrian Hamster',
    price: 600,
    age: '5 months',
    character: ['Active at Night', 'Cute Forager', 'Hand-Tamed'],
    image: 'hamstar.jpg.png',
    description: 'Peanut is an active little builder who enjoys burrowing in bedding and running on his wheel.'
  },
  {
    id: 'pet-8',
    name: 'Luna',
    species: 'Dogs',
    breed: 'Indie / Collie Mix',
    price: 1500,
    age: '2 years',
    character: ['Intelligent', 'Loyal', 'Eager to Learn', 'Agile'],
    image: 'luna.jpg.png',
    description: 'Luna knows basic obedience, loves nature strolls, and makes a loyal lifetime companion.'
  }
];

const speciesList = ['All', 'Dogs', 'Cats', 'Birds', 'Rabbits', 'Fishes', 'Turtles', 'Hamsters'];
let currentFilter = 'All';
let currentSearchTerm = '';

// Render filter buttons
function renderFilters() {
  const container = document.getElementById('filterContainer');
  container.innerHTML = speciesList.map(species => {
    const isActive = currentFilter.toLowerCase() === species.toLowerCase();
    return `
      <button 
        type="button"
        onclick="setFilter('${species}')" 
        class="px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
          isActive 
            ? 'bg-slate-900 text-white shadow-md' 
            : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-800'
        }"
      >
        ${species}
      </button>
    `;
  }).join('');
}

// Render pet cards with Indian Rupee formatting (₹)
function renderPets() {
  const grid = document.getElementById('petsGrid');
  const noResults = document.getElementById('noResults');

  const filtered = petDirectory.filter(pet => {
    const matchCategory = (currentFilter === 'All') || (pet.species.toLowerCase() === currentFilter.toLowerCase());
    const term = currentSearchTerm.toLowerCase().trim();
    const matchSearch = !term || 
      pet.name.toLowerCase().includes(term) ||
      pet.breed.toLowerCase().includes(term) ||
      pet.species.toLowerCase().includes(term) ||
      pet.character.some(c => c.toLowerCase().includes(term));
    
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');
  grid.innerHTML = filtered.map(pet => {
    const charPills = pet.character.map(c => 
      `<span class="text-[10px] font-semibold bg-amber-100/70 text-amber-800 px-2 py-0.5 rounded-md">${c}</span>`
    ).join('');

    return `
      <div class="bg-white rounded-2xl border border-amber-100/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
        <div class="relative overflow-hidden h-52 bg-slate-100">
          <img 
            src="${pet.image}" 
            alt="${pet.name} - ${pet.breed}" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onerror="this.src='https://placehold.co/600x400/fef3c7/b45309?text=${encodeURIComponent(pet.name)}'"
          />
          <span class="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm border border-slate-100">
            ${pet.species}
          </span>
          <div class="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-bold">
            Fee: ₹${pet.price.toLocaleString('en-IN')}
          </div>
        </div>

        <div class="p-5 flex flex-col flex-grow">
          <div class="flex items-baseline justify-between">
            <h3 class="font-heading font-extrabold text-xl text-slate-900">${pet.name}</h3>
            <span class="text-xs font-medium text-slate-500">${pet.age}</span>
          </div>
          <p class="text-xs font-medium text-amber-700 mt-0.5">${pet.breed}</p>
          <p class="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
            ${pet.description}
          </p>

          <div class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
            ${charPills}
          </div>

          <div class="mt-5 pt-3 border-t border-slate-100">
            <button 
              type="button"
              onclick="selectPetForAdoption('${pet.name}', '${pet.species.slice(0, -1) || pet.species}', '${pet.age}')"
              class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <i data-lucide="heart-handshake" class="w-4 h-4"></i>
              Adopt ${pet.name}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) {
    lucide.createIcons();
  }
}

function setFilter(species) {
  currentFilter = species;
  renderFilters();
  renderPets();
}

function filterBySpecies(species) {
  setFilter(species);
}

function resetFilters() {
  currentFilter = 'All';
  currentSearchTerm = '';
  document.getElementById('petSearchInput').value = '';
  renderFilters();
  renderPets();
}

document.getElementById('petSearchInput').addEventListener('input', (e) => {
  currentSearchTerm = e.target.value;
  renderPets();
});

// Auto-fill form when "Adopt Me" is clicked on any card
function selectPetForAdoption(petName, petType, petAge) {
  const typeSelect = document.getElementById('formPetType');
  const nameInput = document.getElementById('formPetName');
  const ageInput = document.getElementById('formPetAge');

  nameInput.value = petName;
  ageInput.value = petAge;

  let matched = false;
  for (let i = 0; i < typeSelect.options.length; i++) {
    if (typeSelect.options[i].value.toLowerCase() === petType.toLowerCase()) {
      typeSelect.selectedIndex = i;
      matched = true;
      break;
    }
  }
  if (!matched) {
    typeSelect.value = 'Other';
  }

  const banner = document.getElementById('prefillNotification');
  document.getElementById('prefillBannerTitle').textContent = `Ready to adopt ${petName} (${petAge})!`;
  banner.classList.remove('hidden');

  document.getElementById('adoption-form').scrollIntoView({ behavior: 'smooth' });
}

function dismissBanner() {
  document.getElementById('prefillNotification').classList.add('hidden');
}

// Canvas Digital Signature
const canvas = document.getElementById('sigCanvas');
const ctx = canvas.getContext('2d');
const placeholder = document.getElementById('sigPlaceholder');
let isDrawing = false;
let hasSigned = false;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  
  let backupData = null;
  if (hasSigned) {
    backupData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#0f172a';

  if (backupData && hasSigned) {
    ctx.putImageData(backupData, 0, 0);
  }
}

window.addEventListener('resize', resizeCanvas);
setTimeout(resizeCanvas, 100);

function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  let clientX, clientY;
  if (e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function startSign(e) {
  isDrawing = true;
  placeholder.classList.add('hidden');
  const pos = getPointerPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
  if (e.type === 'touchstart') e.preventDefault();
}

function moveSign(e) {
  if (!isDrawing) return;
  const pos = getPointerPos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  hasSigned = true;
  document.getElementById('sigErr').classList.add('hidden');
  if (e.type === 'touchmove') e.preventDefault();
}

function stopSign() {
  if (isDrawing) {
    isDrawing = false;
    ctx.closePath();
  }
}

function clearSignature() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hasSigned = false;
  placeholder.classList.remove('hidden');
}

canvas.addEventListener('mousedown', startSign);
canvas.addEventListener('mousemove', moveSign);
window.addEventListener('mouseup', stopSign);

canvas.addEventListener('touchstart', startSign, { passive: false });
canvas.addEventListener('touchmove', moveSign, { passive: false });
window.addEventListener('touchend', stopSign);

document.getElementById('clearSigBtn').addEventListener('click', clearSignature);

// Form Submission & Validation

function submit(){
  alert('Form Submitted Successfully');
}
const form = document.getElementById('adoptionApplicationForm');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  let isValid = true;

  const fields = [
    { id: 'applicantName', err: 'applicantNameErr' },
    { id: 'phoneNumber', err: 'phoneNumberErr' },
    { id: 'emailAddress', err: 'emailAddressErr', isEmail: true },
    { id: 'residentialAddress', err: 'residentialAddressErr' },
    { id: 'formPetType', err: 'formPetTypeErr' },
    { id: 'formPetName', err: 'formPetNameErr' },
    { id: 'formPetAge', err: 'formPetAgeErr' },
    { id: 'homeType', err: 'homeTypeErr' },
    { id: 'primaryCaretaker', err: 'primaryCaretakerErr' },
    { id: 'previousExperience', err: 'previousExperienceErr' },
    { id: 'reasonForAdoption', err: 'reasonForAdoptionErr' },
  ];

  fields.forEach(field => {
    const input = document.getElementById(field.id);
    const errEl = document.getElementById(field.err);
    const value = input.value.trim();

    if (!value) {
      errEl.classList.remove('hidden');
      input.classList.add('border-rose-400', 'bg-rose-50/20');
      isValid = false;
    } else if (field.isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errEl.classList.remove('hidden');
      input.classList.add('border-rose-400', 'bg-rose-50/20');
      isValid = false;
    } else {
      errEl.classList.add('hidden');
      input.classList.remove('border-rose-400', 'bg-rose-50/20');
    }
  });

  const sigErr = document.getElementById('sigErr');
  if (!hasSigned) {
    sigErr.classList.remove('hidden');
    isValid = false;
  } else {
    sigErr.classList.add('hidden');
  }

  const termsCheck = document.getElementById('termsAgreement');
  const termsErr = document.getElementById('termsErr');
  if (!termsCheck.checked) {
    termsErr.classList.remove('hidden');
    isValid = false;
  } else {
    termsErr.classList.add('hidden');
  }

  if (!isValid) return;

  const applicantName = document.getElementById('applicantName').value.trim();
  const petName = document.getElementById('formPetName').value.trim();
  const petType = document.getElementById('formPetType').value;
  const email = document.getElementById('emailAddress').value.trim();

  const randomTrack = 'PAW-' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('modalTrackingId').textContent = '#' + randomTrack;
  document.getElementById('modalApplicantName').textContent = applicantName;
  document.getElementById('modalPetDetails').textContent = `${petName} (${petType})`;
  document.getElementById('modalEmail').textContent = email;

  const modal = document.getElementById('successModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');

  if (window.lucide) {
    lucide.createIcons();
  }

  form.reset();
  clearSignature();
  dismissBanner();
});

function closeModal() {
  const modal = document.getElementById('successModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// Mobile navigation menu toggle
const mobileBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
mobileBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
});

// Initialization
window.addEventListener('DOMContentLoaded', () => {
  renderFilters();
  renderPets();
  if (window.lucide) {
    lucide.createIcons();
  }
});
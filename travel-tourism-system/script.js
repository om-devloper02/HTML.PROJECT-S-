// ===== Local Storage Management =====
function getFromStorage(key, defaultValue = []) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ===== Authentication =====
function switchTab(tab) {
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'login') {
        document.getElementById('login-form').classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('register-form').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = getFromStorage('users');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showPage('home');
        updateNavigation();
        loadFeaturedDestinations();
        alert('Login successful!');
    } else {
        alert('Invalid email or password!');
    }
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value;
    
    const users = getFromStorage('users');
    if (users.find(u => u.email === email)) {
        alert('Email already registered!');
        return;
    }
    
    const newUser = { email, password, name, phone };
    users.push(newUser);
    saveToStorage('users', users);
    
    alert('Registration successful! Please login.');
    switchTab('login');
    document.getElementById('regName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regPhone').value = '';
});

function logout() {
    localStorage.removeItem('currentUser');
    switchTab('login');
    showPage('auth');
    updateNavigation();
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function updateNavigation() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const logoutBtn = document.getElementById('logoutBtn');
    const adminBtn = document.getElementById('adminBtn');
    
    if (currentUser) {
        logoutBtn.style.display = 'block';
        if (currentUser.email === 'admin@example.com') {
            adminBtn.style.display = 'block';
        } else {
            adminBtn.style.display = 'none';
        }
    } else {
        logoutBtn.style.display = 'none';
        adminBtn.style.display = 'none';
    }
}

// ===== Page Navigation =====
function showPage(pageName) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (pageName !== 'auth' && !currentUser) {
        showPage('auth');
        return;
    }
    
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageName + '-page').classList.add('active');
    
    if (pageName === 'destinations') {
        loadDestinations();
    } else if (pageName === 'bookings') {
        loadBookings();
    } else if (pageName === 'reviews') {
        loadReviews();
    } else if (pageName === 'admin') {
        loadAdminPanel();
    }
}

// ===== Recommendation System =====
document.getElementById('preferences-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const budget = document.getElementById('budget').value;
    const season = document.getElementById('season').value;
    const travelType = document.getElementById('travelType').value;
    const location = document.getElementById('location').value;
    
    const recommendations = destinations.filter(dest => {
        const budgetMatch = dest.budget === budget;
        const seasonMatch = dest.season.includes(season);
        const typeMatch = dest.type.includes(travelType);
        const locationMatch = dest.location === location;
        
        return budgetMatch && seasonMatch && typeMatch && locationMatch;
    });
    
    if (recommendations.length === 0) {
        alert('No destinations match your preferences. Try different filters!');
        return;
    }
    
    displayRecommendations(recommendations);
    showPage('destinations');
});

function displayRecommendations(recs) {
    const list = document.getElementById('destinations-list');
    list.innerHTML = '';
    
    recs.forEach(dest => {
        list.innerHTML += createDestinationCard(dest);
    });
    
    document.querySelectorAll('.destination-card').forEach(card => {
        card.addEventListener('click', function() {
            const destId = this.dataset.id;
            showDestinationDetails(parseInt(destId));
        });
    });
}

// ===== Destinations Display =====
function loadDestinations() {
    const list = document.getElementById('destinations-list');
    list.innerHTML = '';
    
    destinations.forEach(dest => {
        list.innerHTML += createDestinationCard(dest);
    });
    
    document.querySelectorAll('.destination-card').forEach(card => {
        card.addEventListener('click', function() {
            const destId = this.dataset.id;
            showDestinationDetails(parseInt(destId));
        });
    });
}

function loadFeaturedDestinations() {
    const featured = document.getElementById('featured-destinations');
    featured.innerHTML = '';
    
    destinations.slice(0, 3).forEach(dest => {
        featured.innerHTML += createDestinationCard(dest);
    });
    
    document.querySelectorAll('#featured-destinations .destination-card').forEach(card => {
        card.addEventListener('click', function() {
            const destId = this.dataset.id;
            showDestinationDetails(parseInt(destId));
        });
    });
}

function createDestinationCard(dest) {
    return `
        <div class="destination-card" data-id="${dest.id}">
            <div class="destination-image" style="background-image: url('${dest.image}'); background-size: cover; background-position: center;"></div>
            <div class="destination-info">
                <h3>${dest.name}</h3>
                <p>${dest.description}</p>
                <div class="destination-meta">
                    <span>📍 ${dest.location}</span>
                    <span>💰 ${dest.budget}</span>
                </div>
                <div class="destination-price">₹${dest.price}</div>
                <button class="btn btn-primary" onclick="showDestinationDetails(${dest.id})">View Details</button>
            </div>
        </div>
    `;
}

function showDestinationDetails(destId) {
    const dest = destinations.find(d => d.id === destId);
    if (!dest) return;
    
    const modal = document.getElementById('destination-modal');
    const modalBody = document.getElementById('modal-body');
    
    let hotelsHtml = dest.hotels.map(h => `
        <div style="padding: 0.5rem 0; border-bottom: 1px solid #eee;">
            <strong>${h.name}</strong> - ₹${h.price}/night ⭐ ${h.rating}
        </div>
    `).join('');
    
    modalBody.innerHTML = `
        <h2>${dest.emoji} ${dest.name}</h2>
        <p>${dest.description}</p>
        
        <h3>Highlights</h3>
        <ul style="margin-left: 1.5rem;">
            ${dest.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
        
        <h3>Package Details</h3>
        <p><strong>Price per person:</strong> ₹${dest.price}</p>
        <p><strong>Best Season:</strong> ${dest.season.join(', ')}</p>
        <p><strong>Travel Type:</strong> ${dest.type.join(', ')}</p>
        <p><strong>Location:</strong> ${dest.location}</p>
        
        <h3>Available Hotels</h3>
        <div>${hotelsHtml}</div>
        
        <button class="btn btn-primary" onclick="bookDestination(${dest.id})">Book Now</button>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('destination-modal').classList.remove('active');
}

// ===== Booking System =====
function bookDestination(destId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const dest = destinations.find(d => d.id === destId);
    
    const travelers = prompt('Number of travelers:', '1');
    if (!travelers || isNaN(travelers) || travelers < 1) return;
    
    const hotel = prompt('Select hotel (1-' + dest.hotels.length + '):', '1');
    if (!hotel || isNaN(hotel) || hotel < 1 || hotel > dest.hotels.length) return;
    
    const selectedHotel = dest.hotels[hotel - 1];
    const days = prompt('Number of days:', '3');
    if (!days || isNaN(days) || days < 1) return;
    
    const totalCost = (dest.price * travelers) + (selectedHotel.price * days);
    
    const booking = {
        id: Date.now(),
        userId: currentUser.email,
        destination: dest.name,
        destId: destId,
        travelers: parseInt(travelers),
        hotel: selectedHotel.name,
        days: parseInt(days),
        totalCost: totalCost,
        date: new Date().toLocaleDateString(),
        status: 'Confirmed'
    };
    
    const bookings = getFromStorage('bookings');
    bookings.push(booking);
    saveToStorage('bookings', bookings);
    
    closeModal();
    alert(`Booking confirmed! Total cost: ₹${totalCost}`);
}

function loadBookings() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const bookings = getFromStorage('bookings').filter(b => b.userId === currentUser.email);
    const list = document.getElementById('bookings-list');
    
    if (bookings.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>No bookings yet. Start exploring destinations!</p></div>';
        return;
    }
    
    list.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <h3>${booking.destination}</h3>
            <div class="booking-details">
                <div class="booking-detail"><strong>Travelers:</strong> ${booking.travelers}</div>
                <div class="booking-detail"><strong>Hotel:</strong> ${booking.hotel}</div>
                <div class="booking-detail"><strong>Days:</strong> ${booking.days}</div>
                <div class="booking-detail"><strong>Total Cost:</strong> ₹${booking.totalCost}</div>
                <div class="booking-detail"><strong>Booked on:</strong> ${booking.date}</div>
            </div>
            <span class="booking-status status-confirmed">${booking.status}</span>
        </div>
    `).join('');
}

// ===== Reviews System =====
function loadReviews() {
    const reviewDest = document.getElementById('reviewDestination');
    reviewDest.innerHTML = '<option value="">Select Destination</option>';
    destinations.forEach(dest => {
        reviewDest.innerHTML += `<option value="${dest.id}">${dest.name}</option>`;
    });
    
    displayAllReviews();
}

document.getElementById('review-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const destId = document.getElementById('reviewDestination').value;
    const name = document.getElementById('reviewName').value;
    const text = document.getElementById('reviewText').value;
    const rating = document.getElementById('reviewRating').value;
    
    const review = {
        id: Date.now(),
        destId: parseInt(destId),
        name: name,
        text: text,
        rating: parseInt(rating),
        date: new Date().toLocaleDateString()
    };
    
    const reviews = getFromStorage('reviews');
    reviews.push(review);
    saveToStorage('reviews', reviews);
    
    alert('Review submitted successfully!');
    this.reset();
    displayAllReviews();
});

function displayAllReviews() {
    const reviews = getFromStorage('reviews');
    const list = document.getElementById('reviews-list');
    
    if (reviews.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>No reviews yet. Be the first to review!</p></div>';
        return;
    }
    
    list.innerHTML = reviews.map(review => {
        const dest = destinations.find(d => d.id === parseInt(review.destId));
        return `
            <div class="review-card">
                <div class="review-header">
                    <h4>${dest ? dest.name : 'Unknown'}</h4>
                    <span class="review-rating">${'⭐'.repeat(review.rating)}</span>
                </div>
                <p class="review-text">${review.text}</p>
                <div class="review-meta">By ${review.name} on ${review.date}</div>
            </div>
        `;
    }).join('');
}

// ===== Filter Destinations =====
function applyFilters() {
    const budget = document.getElementById('filterBudget').value;
    const season = document.getElementById('filterSeason').value;
    const location = document.getElementById('filterLocation').value;
    
    const filtered = destinations.filter(dest => {
        const budgetMatch = !budget || dest.budget === budget;
        const seasonMatch = !season || dest.season.includes(season);
        const locationMatch = !location || dest.location === location;
        
        return budgetMatch && seasonMatch && locationMatch;
    });
    
    displayRecommendations(filtered);
}

// ===== Admin Panel =====
function loadAdminPanel() {
    const users = getFromStorage('users');
    const bookings = getFromStorage('bookings');
    const reviews = getFromStorage('reviews');
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('totalReviews').textContent = reviews.length;
    
    // Display users
    const usersList = document.getElementById('usersList');
    if (users.length === 0) {
        usersList.innerHTML = '<p>No users registered yet.</p>';
    } else {
        usersList.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.phone}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    // Display bookings
    const bookingsList = document.getElementById('bookingsList');
    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p>No bookings yet.</p>';
    } else {
        bookingsList.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Destination</th>
                        <th>Travelers</th>
                        <th>Total Cost</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${bookings.map(booking => `
                        <tr>
                            <td>${booking.userId}</td>
                            <td>${booking.destination}</td>
                            <td>${booking.travelers}</td>
                            <td>₹${booking.totalCost}</td>
                            <td>${booking.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}

// ===== Initialize Demo Data =====
function initializeDemoData() {
    if (!localStorage.getItem('users')) {
        const users = [demoUser];
        saveToStorage('users', users);
    }
}

// ===== Page Load =====
document.addEventListener('DOMContentLoaded', function() {
    initializeDemoData();
    updateNavigation();
    
    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        showPage('home');
        loadFeaturedDestinations();
    }
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('destination-modal');
    if (event.target === modal) {
        closeModal();
    }
});

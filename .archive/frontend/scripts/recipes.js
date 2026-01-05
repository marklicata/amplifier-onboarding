/**
 * Recipe Gallery - Client-side rendering and filtering
 * Loads recipes from /data/recipes-showcase.json
 */

// State management
let allRecipes = [];
let filteredRecipes = [];
let currentFilters = {
    category: 'all',
    difficulty: 'all',
    search: ''
};

/**
 * Initialize the recipe gallery
 */
async function initRecipeGallery() {
    try {
        // Load recipes from JSON
        const response = await fetch('/data/recipes-showcase.json');
        const data = await response.json();
        allRecipes = data.recipes;
        filteredRecipes = allRecipes;
        
        // Render recipes
        renderRecipes();
        
        // Set up event listeners
        setupFilters();
        setupSearch();
        
        console.log(`Loaded ${allRecipes.length} recipes`);
    } catch (error) {
        console.error('Error loading recipes:', error);
        showError('Failed to load recipes. Please try again later.');
    }
}

/**
 * Render recipes to the gallery
 */
function renderRecipes() {
    const gallery = document.getElementById('recipe-gallery');
    const noResults = document.getElementById('no-results');
    
    if (!gallery) return;
    
    // Clear gallery
    gallery.innerHTML = '';
    
    // Show no results message if empty
    if (filteredRecipes.length === 0) {
        gallery.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    // Hide no results, show gallery
    gallery.style.display = 'grid';
    noResults.style.display = 'none';
    
    // Render each recipe card
    filteredRecipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        gallery.appendChild(card);
    });
}

/**
 * Create a recipe card element
 */
function createRecipeCard(recipe) {
    const article = document.createElement('article');
    article.className = 'recipe-card';
    article.setAttribute('data-recipe-id', recipe.id);
    
    // Difficulty badge color class
    const difficultyClass = recipe.difficulty.toLowerCase();
    
    article.innerHTML = `
        <div class="recipe-header">
            <h3 class="recipe-title">${escapeHtml(recipe.name)}</h3>
            <div class="recipe-meta">
                <span class="badge badge-difficulty ${difficultyClass}">${escapeHtml(recipe.difficulty)}</span>
                <span class="badge badge-duration">⏱️ ${escapeHtml(recipe.duration)}</span>
                <span class="badge badge-category">${formatCategory(recipe.category)}</span>
            </div>
        </div>
        
        <p class="recipe-description">
            ${escapeHtml(recipe.description.split('.')[0])}.
        </p>
        
        <div class="recipe-actions">
            <a href="/playground/recipes/${recipe.id}.html" class="btn-recipe">
                View Recipe
            </a>
            <button class="btn-recipe-secondary" onclick="showRecipeDetails('${recipe.id}')">
                Quick Preview
            </button>
        </div>
    `;
    
    return article;
}

/**
 * Set up category and difficulty filters
 */
function setupFilters() {
    // Category filters
    const categoryButtons = document.querySelectorAll('[data-category]');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update filter
            currentFilters.category = button.dataset.category;
            applyFilters();
        });
    });
    
    // Difficulty filters
    const difficultyButtons = document.querySelectorAll('[data-difficulty]');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update filter
            currentFilters.difficulty = button.dataset.difficulty;
            applyFilters();
        });
    });
}

/**
 * Set up search box
 */
function setupSearch() {
    const searchBox = document.getElementById('search-box');
    if (!searchBox) return;
    
    // Debounce search input
    let searchTimeout;
    searchBox.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentFilters.search = e.target.value.toLowerCase();
            applyFilters();
        }, 300); // 300ms debounce
    });
}

/**
 * Apply all active filters
 */
function applyFilters() {
    filteredRecipes = allRecipes.filter(recipe => {
        // Category filter
        if (currentFilters.category !== 'all' && recipe.category !== currentFilters.category) {
            return false;
        }
        
        // Difficulty filter
        if (currentFilters.difficulty !== 'all' && recipe.difficulty !== currentFilters.difficulty) {
            return false;
        }
        
        // Search filter
        if (currentFilters.search) {
            const searchLower = currentFilters.search;
            const matchesName = recipe.name.toLowerCase().includes(searchLower);
            const matchesDescription = recipe.description.toLowerCase().includes(searchLower);
            const matchesTags = recipe.tags.some(tag => tag.toLowerCase().includes(searchLower));
            
            if (!matchesName && !matchesDescription && !matchesTags) {
                return false;
            }
        }
        
        return true;
    });
    
    renderRecipes();
}

/**
 * Reset all filters
 */
function resetFilters() {
    // Reset filter state
    currentFilters = {
        category: 'all',
        difficulty: 'all',
        search: ''
    };
    
    // Reset UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === 'all' || btn.dataset.difficulty === 'all') {
            btn.classList.add('active');
        }
    });
    
    const searchBox = document.getElementById('search-box');
    if (searchBox) searchBox.value = '';
    
    // Re-render
    applyFilters();
}

/**
 * Show recipe details (modal or navigation - future)
 */
function showRecipeDetails(recipeId) {
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    // For now, just log to console
    // In Phase 1, this will open a modal or navigate to detail page
    console.log('Recipe Details:', recipe);
    alert(`Recipe: ${recipe.name}\n\n${recipe.description}\n\nValue: ${recipe.valueProposition}\n\n(Detail view coming in Phase 1)`);
}

/**
 * Show error message
 */
function showError(message) {
    const gallery = document.getElementById('recipe-gallery');
    if (!gallery) return;
    
    gallery.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <div class="coming-soon-banner">
                <div class="coming-soon-icon">⚠️</div>
                <h2>Error Loading Recipes</h2>
                <p>${escapeHtml(message)}</p>
                <button onclick="initRecipeGallery()" class="cta">Try Again</button>
            </div>
        </div>
    `;
}

/**
 * Format category for display
 */
function formatCategory(category) {
    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Add smooth scroll behavior for anchor links
 */
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#recipe-') return; // Skip placeholder links
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Track analytics (placeholder for future)
 */
function trackEvent(eventName, eventData) {
    // Placeholder for analytics
    // Future: Integrate with Plausible, Google Analytics, or Azure Application Insights
    console.log('Analytics event:', eventName, eventData);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initRecipeGallery();
        smoothScroll();
    });
} else {
    initRecipeGallery();
    smoothScroll();
}

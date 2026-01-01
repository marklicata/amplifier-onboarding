/**
 * Recipe Validation Script
 * Validates recipes-showcase.json against the schema
 * Run with: node scripts/validate-recipes.js
 */

const fs = require('fs');
const path = require('path');

// Simple JSON schema validator (no dependencies needed)
function validateRecipe(recipe, index) {
    const errors = [];
    const recipeNum = index + 1;

    // Required fields
    const required = ['id', 'name', 'description', 'category', 'difficulty', 'duration', 'agents', 'valueProposition', 'tags'];
    required.forEach(field => {
        if (!recipe[field]) {
            errors.push(`Recipe ${recipeNum}: Missing required field '${field}'`);
        }
    });

    // ID format
    if (recipe.id && !/^[a-z0-9-]+$/.test(recipe.id)) {
        errors.push(`Recipe ${recipeNum}: ID must be kebab-case (lowercase, hyphens only)`);
    }

    // Category validation
    const validCategories = ['code-quality', 'documentation', 'security', 'testing', 'devops', 'data', 'content', 'custom'];
    if (recipe.category && !validCategories.includes(recipe.category)) {
        errors.push(`Recipe ${recipeNum}: Invalid category '${recipe.category}'. Must be one of: ${validCategories.join(', ')}`);
    }

    // Difficulty validation
    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    if (recipe.difficulty && !validDifficulties.includes(recipe.difficulty)) {
        errors.push(`Recipe ${recipeNum}: Invalid difficulty '${recipe.difficulty}'. Must be one of: ${validDifficulties.join(', ')}`);
    }

    // Duration format
    if (recipe.duration && !/^[0-9]+-?[0-9]* (minute|minutes|min)$/.test(recipe.duration)) {
        errors.push(`Recipe ${recipeNum}: Duration must match format '2-3 minutes' or '5 min'`);
    }

    // Agents array
    if (recipe.agents && !Array.isArray(recipe.agents)) {
        errors.push(`Recipe ${recipeNum}: 'agents' must be an array`);
    } else if (recipe.agents && recipe.agents.length === 0) {
        errors.push(`Recipe ${recipeNum}: Must specify at least one agent`);
    }

    // Tags
    if (recipe.tags && !Array.isArray(recipe.tags)) {
        errors.push(`Recipe ${recipeNum}: 'tags' must be an array`);
    } else if (recipe.tags && recipe.tags.length < 2) {
        errors.push(`Recipe ${recipeNum}: Must have at least 2 tags`);
    }

    // Value proposition length
    if (recipe.valueProposition && recipe.valueProposition.length > 200) {
        errors.push(`Recipe ${recipeNum}: Value proposition too long (${recipe.valueProposition.length} chars, max 200)`);
    }

    // Use cases
    if (recipe.useCases) {
        if (!Array.isArray(recipe.useCases)) {
            errors.push(`Recipe ${recipeNum}: 'useCases' must be an array`);
        } else if (recipe.useCases.length < 3) {
            errors.push(`Recipe ${recipeNum}: Must have at least 3 use cases`);
        }
    }

    return errors;
}

// Main validation
function validateRecipes() {
    console.log('🔍 Validating recipes-showcase.json...\n');

    try {
        // Read recipes file
        const recipesPath = path.join(__dirname, '../data/recipes-showcase.json');
        const recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));

        if (!recipesData.recipes || !Array.isArray(recipesData.recipes)) {
            console.error('❌ Invalid file structure: Expected { "recipes": [...] }');
            process.exit(1);
        }

        const recipes = recipesData.recipes;
        console.log(`Found ${recipes.length} recipes to validate\n`);

        let allErrors = [];
        recipes.forEach((recipe, index) => {
            const errors = validateRecipe(recipe, index);
            if (errors.length > 0) {
                allErrors = allErrors.concat(errors);
            }
        });

        if (allErrors.length === 0) {
            console.log('✅ All recipes valid!\n');
            console.log('Summary:');
            console.log(`  Total recipes: ${recipes.length}`);
            console.log(`  Categories: ${[...new Set(recipes.map(r => r.category))].join(', ')}`);
            console.log(`  Difficulties: ${[...new Set(recipes.map(r => r.difficulty))].join(', ')}`);
            console.log(`  Agents used: ${[...new Set(recipes.flatMap(r => r.agents))].join(', ')}`);
            process.exit(0);
        } else {
            console.error('❌ Validation errors found:\n');
            allErrors.forEach(error => {
                console.error(`  - ${error}`);
            });
            console.error(`\nTotal errors: ${allErrors.length}`);
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error reading or parsing recipes file:', error.message);
        process.exit(1);
    }
}

// Run validation
validateRecipes();

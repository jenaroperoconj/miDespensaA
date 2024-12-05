import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RecipeService } from '../services/recipe.service';
import { FirestoreService } from '../services/firestore.service';
import { AuthService } from '../services/authservice.service';


interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}


interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredients: Ingredient[];
  extendedIngredients: Ingredient[];
  instructions: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userEmail: string = '';
  recipes: Recipe[] = []; 
  filteredRecipes: Recipe[] = []; 
  selectedRecipe: Recipe | null = null; 
  availableIngredients: Ingredient[] = []; 
  missingIngredients: Ingredient[] = []; 
  instructions: string[] = [];
  expiredProducts: any[] = []; 
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private recipeService: RecipeService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit(): void {
    this.loadIngredientsAndRecipes();
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.userEmail = user.email;
      } else {
        this.userEmail = '';
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  private loadIngredientsAndRecipes(): void {
    this.firestoreService.getProducts().subscribe(
      (products) => {
        const ingredients = products.map(product => product.nombre);
        this.fetchRecipes(ingredients);
      },
      (error) => {
        this.loading = false;
        this.showError('Error al cargar ingredientes y recetas.');
      }
    );
  }

  private fetchRecipes(ingredients: string[]): void {
    this.recipeService.getRecipesByIngredients(ingredients).subscribe(
      (data) => {
        this.recipes = data.map((recipe: any) => ({
          ...recipe,
          usedIngredients: recipe.usedIngredients || [],
          extendedIngredients: recipe.extendedIngredients || [],
        }));
        this.filteredRecipes = this.recipes;  
        this.loading = false;
        localStorage.setItem('cachedRecipes', JSON.stringify(data));
      },
      (error) => {
        this.loading = false;
        this.showError('Error al cargar recetas.');
      }
    );
  }

  selectRecipe(recipeId: number): void {
    this.loading = true;
    this.recipeService.getRecipeInformation(recipeId).subscribe(
      (recipe) => {
        this.setRecipeDetails(recipe);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.showError('Error al cargar los detalles de la receta.');
      }
    );
  }

  private setRecipeDetails(recipe: Recipe): void {
    this.selectedRecipe = {
      ...recipe,
      usedIngredients: recipe.usedIngredients || [],
      extendedIngredients: recipe.extendedIngredients || []
    };

    this.instructions = recipe.instructions ? recipe.instructions.split('. ') : [];
    this.availableIngredients = recipe.extendedIngredients.filter((ingredient: Ingredient) =>
      this.isIngredientAvailable(ingredient.name)
    );
    this.missingIngredients = recipe.extendedIngredients.filter((ingredient: Ingredient) =>
      !this.isIngredientAvailable(ingredient.name)
    );
  }

  private isIngredientAvailable(ingredientName: string): boolean {
    return this.recipes.some(recipe => recipe.usedIngredients.some(ing => ing.name === ingredientName));
  }

  private showError(message: string): void {
    this.authService.showAlert('Error', message, () => {});
  }
}

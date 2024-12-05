import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
//45dd4a3f80794e3487f3d1ecd01025fb
@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiKey = '45dd4a3f80794e3487f3d1ecd01025fb';
  private apiUrl = 'https://api.spoonacular.com/recipes';

  constructor(private http: HttpClient) {}

  getRecipesByIngredients(ingredients: string[]): Observable<any> {
    const params = new HttpParams()
      .set('ingredients', ingredients.join(','))
      .set('number', '10')
      .set('ranking', '1')
      .set('ignorePantry', 'true')
      .set('apiKey', this.apiKey);

    return this.http.get(`${this.apiUrl}/findByIngredients`, { params });
  }

  getRecipeInformation(recipeId: number): Observable<any> {
    const params = new HttpParams().set('apiKey', this.apiKey); 
    return this.http.get(`${this.apiUrl}/${recipeId}/information`, { params }); 
  }
}
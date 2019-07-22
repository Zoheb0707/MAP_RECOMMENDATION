import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'register', loadChildren: './auth/register/register.module#RegisterPageModule' },
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
  { path: 'app', loadChildren: './tabs/tabs.module#TabsPageModule'},
  { path: 'searches', loadChildren: './searches/searches.module#SearchesPageModule' },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'restaurant/:id', loadChildren: './pages/restaurant-info/restaurant-info.module#RestaurantInfoPageModule' }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

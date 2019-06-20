import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'register', loadChildren: './auth/register/register.module#RegisterPageModule' },
  { path: '', loadChildren: './auth/login/login.module#LoginPageModule' },
  { path: 'app', loadChildren: './tabs/tabs.module#TabsPageModule'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

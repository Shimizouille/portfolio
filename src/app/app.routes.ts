import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Projects } from './pages/projects/projects';
import { Skills } from './pages/skills/skills';
import { Infos } from './pages/infos/infos';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'projects', component: Projects },
    { path: 'skills', component: Skills },
    { path: 'infos', component: Infos },
    { path: '**', redirectTo: '' } // fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
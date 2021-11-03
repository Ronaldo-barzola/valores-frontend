import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcesoComponent } from './pages/proceso/proceso.component';
import { DeudaContribComponent } from './pages/deuda-contrib/deuda-contrib.component';
import { ListadoContribComponent } from './pages/listado-contrib/listado-contrib.component';
import { ObtencionDeudaComponent } from './pages/obtencion-deuda/obtencion-deuda.component';

const routes: Routes = [
  { path: 'proceso', component: ProcesoComponent },
  { path: 'deuda-contrib', component: DeudaContribComponent },
  { path: 'listado-contrib/:numpro', component: ListadoContribComponent },
  { path: 'obtencion-deuda', component: ObtencionDeudaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

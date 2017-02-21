import {Routes,RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {GeGrupoParametroListComponent} from './configuracion/GeGrupoParametro/list.component';
import {GeInventoFormComponent} from './configuracion/GeInventos/form.component';
import {AuthCanActive} from './seguridad/auth.can.active';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './seguridad/login/login';
import {GeParametroListComponent} from './configuracion/GeParametro/list.component';
import {GeMonedaListComponent} from './configuracion/GeMoneda/list.component';

import {GeSocioNegocioListComponent} from './configuracion/GeSocioNegocio/list.component'
import {GeSocioNegocioCuentaListComponent} from './configuracion/GeSocioNegocioCuenta/list.component'

import {SeUsuarioListComponent} from './seguridad/SeUsuario/list.component'
import {SeRolListComponent} from './seguridad/SeRol/list.component'
import {SeUsuarioProfileComponent} from './seguridad/SeUsuario/profile.component'


export const routes: Routes = [
    {path: '', component: HomeComponent, canActivate: [AuthCanActive]},
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent, canActivate: [AuthCanActive]},
    {path: 'grupoParametroList', component: GeGrupoParametroListComponent, canActivate: [AuthCanActive]},
    {path: 'parametroList', component: GeParametroListComponent, canActivate: [AuthCanActive]},
    {path: 'inventoForm', component: GeInventoFormComponent, canActivate: [AuthCanActive]},
    {path: 'monedaList', component: GeMonedaListComponent, canActivate: [AuthCanActive]},

    {path: 'socioNegocioList', component:GeSocioNegocioListComponent, canActivate: [AuthCanActive]},
    {path: 'socioNegocioCuentaList', component:GeSocioNegocioCuentaListComponent, canActivate: [AuthCanActive]},
    {path: 'usuarioList', component:SeUsuarioListComponent, canActivate: [AuthCanActive]},
    {path: 'rolList', component:SeRolListComponent, canActivate: [AuthCanActive]},
    {path: 'profileForm', component:SeUsuarioProfileComponent, canActivate: [AuthCanActive]}
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './forms';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DownloadComponent } from './download/download.component';
import { AuthGuard } from './guards/auth.guards';
import { NavbarComponent } from './navbar/navbar.component';
import { OntologyTreeComponent } from './ontology-tree/ontology-tree.component';
import { DialogComponent } from './dialog/dialog.component';
import { UserTreeComponent } from './user-tree/user-tree.component';
import { AdminComponent } from './admin/admin.component';
import { HelpComponent } from './help/help.component';
import { SendmailComponent } from './forms/sendmail.component';
import { OntologyDescriptionComponent } from './documentation/ontology-description.component';




const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'trees',component: OntologyTreeComponent,canActivate: [AuthGuard]},
  { path: 'tree',component: UserTreeComponent,canActivate: [AuthGuard]},
  { path: 'download',component: DownloadComponent,canActivate: [AuthGuard]},
  { path: 'home',component: HomeComponent},
  { path: 'navbars',component: NavbarComponent},
  { path: 'generic',component: FormComponent},
  { path: 'ontologies',component: OntologyDescriptionComponent},
  { path: 'admin',component: AdminComponent, canActivate: [AuthGuard]},
  { path: 'help',component: HelpComponent, canActivate: [AuthGuard]},
  { path: 'mail',component: SendmailComponent,canActivate: [AuthGuard]}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

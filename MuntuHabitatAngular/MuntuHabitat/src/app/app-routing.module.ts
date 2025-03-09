import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register/register.component';
import { ActivateAccountComponent } from './pages/activate-account/activate-account/activate-account.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { MainComponent } from './pages/main/main.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { AdminHomeComponent } from './dashbords/admin-home/admin-home.component';
import { AgentHomeComponent } from './dashbords/agent-home/agent-home.component';
import { ContratComponent } from './ClientServices/sidebar/contrat/contrat.component';
import { SimulationComponent } from './Simulation/simulation/simulation.component';
import { AddSimulationComponent } from './Simulation/add-simulation/add-simulation.component';
import { ListUsersComponent } from './dashbords/gestionUsers/list-users/list-users.component';
import { AddAgentComponent } from './dashbords/gestionUsers/add-agent/add-agent.component';
import { DetailsSimulationComponent } from './Simulation/details-simulation/details-simulation.component';
import { AddCategorieComponent } from './Categorie/add-categorie/add-categorie.component';
import { AddFactureComponent } from './AgentManagement/add-facture/add-facture.component';
import { ListFacturesComponent } from './ClientServices/list-factures/list-factures.component';
import { ListDevisComponent } from './ClientServices/devis/list-devis/list-devis.component';
import { DetailsDevisComponent } from './AgentManagement/details-devis/details-devis.component';
import { DocumentComponent } from './ClientServices/sidebar/document/document.component';
import { ServicesComponent } from './ClientServices/sidebar/services/services.component';
import { AddContratComponent } from './AgentManagement/add-contrat/add-contrat.component';
import { ListContratComponent } from './AgentManagement/list-contrat/list-contrat.component';
import { ProspectListComponent } from './dashbords/gestionUsers/prospect-list/prospect-list.component';
import { AddPrestationComponent } from './ClientServices/BasePrix/add-prestation/add-prestation.component';
import { PrestationListComponent } from './ClientServices/BasePrix/prestation-list/prestation-list.component';
import { UpdatePrestationComponent } from './ClientServices/BasePrix/update-prestation/update-prestation.component';
import { adminGuard, agentGuard, clientGuard, userGuard } from './services/guard/auth.guard';
import { ProspectDetailsComponent } from './dashbords/gestionUsers/prospect-details/prospect-details.component';
import { AddPostComponent } from './AgentManagement/add-post/add-post.component';
import { ListPostComponent } from './ClientServices/list-post/list-post.component';
import { AllPostsComponent } from './AgentManagement/all-posts/all-posts.component';
import { AddAppointmentComponent } from './ClientServices/add-appointment/add-appointment.component';
import { ListAppointmentComponent } from './AgentManagement/list-appointment/list-appointment.component';
import { ProspectAssignListComponent } from './AgentManagement/agentUsers/prospect-assign-list/prospect-assign-list.component';
import { ChatComponent } from './chat/chat/chat.component';
import { UserContratComponent } from './ClientServices/user-contrat/user-contrat.component';
import { PrestationPrixComponent } from './Simulation/prestation-prix/prestation-prix.component';
import { AddDevisComponent } from './AgentManagement/add-devis/add-devis.component';
import { DetailsFactureComponent } from './AgentManagement/details-facture/details-facture.component';
import { ReclamationListComponent } from './AgentManagement/reclamation-list/reclamation-list.component';
import { AddReclamationComponent } from './ClientServices/add-reclamation/add-reclamation.component';
import { ListSmulationComponent } from './Simulation/list-smulation/list-smulation.component';
import { ForgotPasswordComponent } from './pages/password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/password/reset-password/reset-password.component';
import { AllFacturesComponent } from './dashbords/gestionUsers/all-factures/all-factures.component';
import { AllDevisComponent } from './dashbords/gestionUsers/all-devis/all-devis.component';
import { AllReclamationsComponent } from './dashbords/gestionUsers/all-reclamations/all-reclamations.component';

const routes: Routes = [


  {path:"",redirectTo:"home", pathMatch:"full"},
  {path: "notfound" , component:NotFoundComponent},
  {path: "login" , component:LoginComponent},
  {path: "register" , component:RegisterComponent},
  {path: "activate-account" , component:ActivateAccountComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {path: "home" , component:HomeComponent, children: [
    // {path: 'simulation',component: SimulationComponent}
]},


  { path: 'detail/:id', component: AddCategorieComponent },
  {path: 'simulation',component: SimulationComponent },
  { path: 'realisation', component: DetailsSimulationComponent},


  {path: "main" , component:MainComponent, children: [
    {path: 'profile', component: ProfilComponent,canActivate: [userGuard]},
    {path: 'document',component: DocumentComponent,canActivate: [clientGuard],children: [
        {path: 'listfact',component: ListFacturesComponent,canActivate: [clientGuard]},
        {path: 'listDevis',component: ListDevisComponent,canActivate: [clientGuard]},
        {path: 'Moncontrat',component: UserContratComponent,canActivate: [clientGuard] },]
    },
    {path: 'contrat',component: ContratComponent,canActivate: [clientGuard] },
    {path: "chat" , component:ChatComponent,canActivate: [clientGuard]},
    {path: 'services',component: ServicesComponent,canActivate: [clientGuard], children:[
        {path: 'posts',component: ListPostComponent,canActivate: [clientGuard]},
        {path: 'rendezvous',component: AddAppointmentComponent,canActivate: [clientGuard]},
        {path: 'addreclamation',component: AddReclamationComponent,canActivate: [clientGuard]}]
    },],canActivate : [clientGuard]
  },


  {path: "admin" , component:AdminHomeComponent, children: [
    {path: 'profile', component: ProfilComponent,canActivate: [userGuard]},
    {path: 'addSimulation',component: AddSimulationComponent,canActivate:[adminGuard]},
    {path: 'listSimulation',component: ListSmulationComponent,canActivate:[adminGuard]},
    {path: 'UserList', component: ListUsersComponent,canActivate:[adminGuard]},
    {path: 'addagent',component: AddAgentComponent,canActivate:[adminGuard]},
    {path: 'prospect',component: ProspectListComponent,canActivate:[adminGuard]},
    {path: "agentscontrat" , component:ProspectDetailsComponent,canActivate: [adminGuard]},
    {path : "listfact" , component: AllFacturesComponent, canActivate : [adminGuard]},
    {path : "listd" , component: AllDevisComponent, canActivate : [adminGuard]},
    {path : "allreclamation" , component:AllReclamationsComponent, canActivate : [adminGuard]},
    {path: "adminposts" , component:ChatComponent,canActivate: [adminGuard]},],canActivate:[adminGuard]

  },


  {path: "agentHome" , component:AgentHomeComponent, children: [
    {path: 'profile', component: ProfilComponent,canActivate: [userGuard]},
    {path: 'addfacture',component: AddFactureComponent,canActivate:[agentGuard]},
    {path: 'listfactures',component: DetailsFactureComponent,canActivate:[agentGuard] },
    {path: 'adddevis',component: AddDevisComponent,canActivate:[agentGuard] },
    {path: 'listDevis',component: DetailsDevisComponent,canActivate:[agentGuard]},
    { path: 'Listprix/update/:id', component: UpdatePrestationComponent,canActivate:[agentGuard] },
    { path: 'contrat', component: AddContratComponent,canActivate:[agentGuard] },
    { path: 'addprestation', component: AddPrestationComponent ,canActivate:[agentGuard]},
    { path: 'Listprix', component: PrestationListComponent,canActivate:[agentGuard]},
    {path: 'addpost',component: AddPostComponent,canActivate:[agentGuard] },
    {path: 'postlist',component: AllPostsComponent,canActivate:[agentGuard]},
    {path: 'rendezvlist',component: ListAppointmentComponent,canActivate:[agentGuard]},
    {path: 'prospects',component: ProspectAssignListComponent,canActivate:[agentGuard]},
    {path: "assignusers" , component:PrestationPrixComponent,canActivate: [agentGuard]},
    {path: "allcontrat" , component:ListContratComponent,canActivate: [agentGuard]},
    { path: 'agentreclamation', component: ReclamationListComponent,canActivate:[agentGuard]},
    {path: "chata" , component:ChatComponent,canActivate: [agentGuard]},],canActivate:[agentGuard]
  },
  { path: 'devis/:id', component: DetailsDevisComponent },
  {path: '**', component: NotFoundComponent}



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TokenService } from '../../services/token/token.service';
import { Question, TypeSimulation } from '../../services/models';
import { SimulationControllerService } from '../../services/services';

@Component({
  selector: 'app-header-home',
  templateUrl: './header-home.component.html',
  styleUrls: ['./header-home.component.css']
})
export class HeaderHomeComponent implements OnInit, OnDestroy {

  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  selectedAnswers: number[] = [];
  selectedType: TypeSimulation | null = null;
  TypeSimulation = TypeSimulation;

  constructor(private readonly apiService: TokenService, private router: Router, private questionService: SimulationControllerService) { }

  isAdmin: boolean = false;
  isClient: boolean = false;
  isAgent: boolean = false;
  isAuthenticated: boolean = false;
  private authStatusSub: Subscription | null = null;



  ngOnInit(): void {
    this.isAuthenticated = this.apiService.isAuthenticated();
    this.isAdmin = this.apiService.isAdmin();
    this.isClient = this.apiService.isClient();
    this.isAgent = this.apiService.isAgent();



    this.authStatusSub = this.apiService.authStatuschanged.subscribe(() => {
      this.isAuthenticated = this.apiService.isAuthenticated();
      this.isAdmin = this.apiService.isAdmin();
      this.isClient = this.apiService.isClient();
      this.isAgent = this.apiService.isAgent();

    })

    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService.getData().subscribe((questions: Question[]) => {
      this.questions = questions;
      this.filterQuestions();
      this.selectedAnswers = new Array(questions.length).fill(undefined);
    });
  }

  filterQuestions() {
    if (this.selectedType) {
      this.filteredQuestions = this.questions.filter(q => q.type === this.selectedType);
    } else {
      this.filteredQuestions = [];
    }
  }

  goToDetails(id: number): void {
    this.router.navigate(['/detail', id]).then(() => {
      window.location.reload(); // Recharge la page après la navigation
    });;

  }

  setType(type: TypeSimulation) {
    this.selectedType = type;
    this.filterQuestions();
  }
  gotorealisation(){
    this.router.navigate(['realisation']);
  }

  login(){
    if (this.isAuthenticated) {
      if (this.isAdmin) {
        this.router.navigate(['/admin/profile']);
      } else if (this.isAgent) {
        this.router.navigate(['/agentHome/profile']);
      } else if (this.isClient) {
        this.router.navigate(['/main/profile']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }


}

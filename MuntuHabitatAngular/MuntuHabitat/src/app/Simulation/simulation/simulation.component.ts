import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Question, RegistrationRequest, Role } from '../../services/models';
import { AuthenticationService, SimulationControllerService } from '../../services/services';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrl: './simulation.component.css'
})
export class SimulationComponent {
  questions: Question[] = [];
  registerRequest: RegistrationRequest = {email: '', firstname: '', lastname: '',phoneNumber :0, password: ''};
  errorMsg: Array<string> = [];
  currentQuestion = 0;
  selectedAnswers: number[] = [];
  showForm = false;
  showResult = false;
  totalScore = 0;
  personalInfoForm: FormGroup;

  constructor(private fb: FormBuilder, private questionService: SimulationControllerService, private authService:AuthenticationService) {
    this.personalInfoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService.getData().subscribe((questions: Question[]) => {
      this.questions = questions;
      // Initialize selectedAnswers array with undefined
      this.selectedAnswers = new Array(questions.length).fill(undefined);
    });
  }

  selectAnswer(questionIndex: number, answerIndex: number) {
    const price = this.questions[questionIndex].categories?.[answerIndex]?.price;
    if (price !== undefined) {
      this.selectedAnswers[questionIndex] = price;
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  nextQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
    }
  }

  submitSimulation() {
    this.showForm = true;
  }

  submitPersonalInfo() {
    this.errorMsg = [];
    this.authService.register({
      body: this.registerRequest
    })
      .subscribe({
        next: () => {
         console.log('success')
        },
        error: (err) => {
          this.errorMsg = err.error.validationErrors;
        }
      });
      if (this.personalInfoForm.valid) {
        // Filter out undefined values and calculate total score
        this.totalScore = this.selectedAnswers.filter(price => price !== undefined).reduce((a, b) => a + (b || 0), 0);
        this.showForm = false;
        this.showResult = true;
        // Send result via email and phone
        this.sendResult();
      } else {
        alert('Veuillez remplir tous les champs obligatoires.');
      }
  }

  sendResult() {
    const personalInfo = this.personalInfoForm.value;
    const resultMessage = `Hello ${personalInfo.firstName} ${personalInfo.lastName}, your total simulation score is ${this.totalScore}$`;

    // Logic to send email and SMS goes here
    console.log('Sending email and SMS with message:', resultMessage);
  }
}

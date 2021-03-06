import { Component, Input, OnInit } from '@angular/core';
import { Question } from '../../models/question';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.scss'],
})
export class AnswersComponent {
  @Input() question!: Question;

  constructor() {}
}

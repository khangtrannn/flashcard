import { Component, OnInit } from '@angular/core';
import { FlashcardService } from 'src/app/services/flashcard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  front = '';
  back = '';

  constructor(public flashcardService: FlashcardService) {}

  ngOnInit() {}

  onAddFlashcard(): void {
    this.resetState();
  }

  private resetState(): void {
    this.front = '';
    this.back = '';
  }
}

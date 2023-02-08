import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FlashcardService } from 'src/app/services/flashcard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  front = '';
  back = '';

  constructor(public flashcardService: FlashcardService, private toastr: ToastrService) {}

  ngOnInit() {}

  onAddFlashcard(): void {
    this.resetState();
    this.toastr.success('Add new flashcard successfully!');
  }

  private resetState(): void {
    this.front = '';
    this.back = '';
  }
}

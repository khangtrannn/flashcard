import { Component, OnInit } from '@angular/core';
import { FlashcardService } from 'src/app/services/flashcard.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  constructor(private flashcardService: FlashcardService) {}

  ngOnInit() {
    this.flashcardService.getAll().subscribe((data) => {
      console.log(data);
    })
  }
}

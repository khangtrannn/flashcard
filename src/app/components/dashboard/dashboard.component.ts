import { EditorConfig } from '../../configs/EditorConfig';
import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  Flashcard,
  FlashcardService,
} from 'src/app/services/flashcard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  editorConfig = EditorConfig;
  front = '';
  back = '';

  constructor(
    public flashcardService: FlashcardService,
    private toastr: ToastrService,
    private elementRef: ElementRef<HTMLDivElement>
  ) {}

  ngOnInit(): void {
    this.flashcardService.disableShortcutListener();
  }

  onAddFlashcard(): void {
    if (!this.front) {
      return;
    }

    this.flashcardService
      .create(this.getPayload())
      .then((_) => {
        this.resetState();
        this.toastr.success('Add new flashcard successfully!');
      })
      .catch((err) => {
        console.error(err);
        this.toastr.error('Add new flashcard error!');
      });
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.querySelectorAll('angular-editor')
      .forEach((editor) => editor
        .querySelector('.angular-editor-textarea')!
        .addEventListener('focus', () => this.flashcardService.flip(editor.getAttribute('name')!)
      ));
  }

  private getPayload(): Flashcard {
    return {
      front: this.front,
      back: this.back,
    };
  }

  private resetState(): void {
    this.front = '';
    this.back = '';
  }
}

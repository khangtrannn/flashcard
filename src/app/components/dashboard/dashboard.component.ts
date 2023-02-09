import { EditorConfig } from '../../configs/EditorConfig';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
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
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly FRONT_TEMPLATE =
    '<div style="text-align: center;"><span style="background-color: rgb(219, 15, 15);"><font size="3">phrase</font></span></div><div style="text-align: center;"><span style="background-color: rgb(219, 15, 15); font-size: 0.875rem;"><br></span></div><div style="text-align: center;"><span style="text-align: center;">Vietnamese meaning</span><br></div>';
  
  readonly BACK_TEMPLATE = '<div style="text-align: center;"><font size="3">Example</font></div>';

  editorConfig = EditorConfig;
  front = this.FRONT_TEMPLATE;
  back = this.BACK_TEMPLATE;

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
    this.elementRef.nativeElement
      .querySelectorAll('angular-editor')
      .forEach((editor) =>
        editor
          .querySelector('.angular-editor-textarea')!
          .addEventListener('focus', () =>
            this.flashcardService.flip(editor.getAttribute('name')!)
          )
      );
  }

  private getPayload(): Flashcard {
    return {
      front: this.front,
      back: this.back,
    };
  }

  private resetState(): void {
    this.front = this.FRONT_TEMPLATE;
    this.back = this.BACK_TEMPLATE;
  }

  ngOnDestroy(): void {
    this.flashcardService.enableShortcutListener();
  }
}

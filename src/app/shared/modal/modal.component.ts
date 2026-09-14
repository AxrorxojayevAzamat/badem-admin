import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  title = input.required<string>();
  closed = output<void>();

  close() {
    this.closed.emit();
  }
}

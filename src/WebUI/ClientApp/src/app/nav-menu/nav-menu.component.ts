import { Component, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  infoModalRef: BsModalRef;
  // infoEditor: any = {};

  constructor(private modalService: BsModalService) { }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

    // Shows the test modal
    showInfoModal(template: TemplateRef<any>): void {
      this.infoModalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
      // setTimeout(() => document.getElementById('title').focus(), 250);
    }

    // Hides the modal on cancel
    hideInfoModal(): void {
      this.infoModalRef.hide();
      // this.addTestEditor = {};
    }
}

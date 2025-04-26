import { Component, OnInit } from '@angular/core';
import { trigger,transition,style,animate } from '@angular/animations';

@Component({
  selector: 'app-shared-layout',
  templateUrl: './shared-layout.component.html',
  styleUrls: ['./shared-layout.component.scss'],
    animations: [
      trigger('fadeIn', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ])
    ]
})
export class SharedLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

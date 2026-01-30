import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { isLoggedIn } from './core/auth/store/auth.action';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  constructor(
    private readonly store: Store,
  ) {}

  protected readonly title = signal('Sama Technical Test');
  ngOnInit(): void {
    this.store.dispatch(isLoggedIn());
  }
}

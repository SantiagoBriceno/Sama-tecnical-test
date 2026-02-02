import { Component } from '@angular/core';
import { SidebarModule } from '../../core/modules/sidebar/sidebar.module';
import { Store } from '@ngrx/store';
import { logout } from '../../core/auth/store/auth.action';
import { FormModule } from "../../core/modules/form/form.module";

@Component({
  selector: 'app-home',
  imports: [SidebarModule, FormModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(
    private store: Store
  ) {}
  handleLogout() {
    this.store.dispatch(logout());
  }
}

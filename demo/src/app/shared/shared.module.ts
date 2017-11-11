import { NgModule } from '@angular/core';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  exports: [HeaderComponent, FooterComponent],
  declarations: [HeaderComponent, FooterComponent]
})
export class SharedModule {
}

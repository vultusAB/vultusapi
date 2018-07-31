import { NgModule } from '@angular/core'
import { RootComponent } from './root.component'
import { RouterModule } from '@angular/router'

namespace Connect {
  export const container = {
    declarations: [ RootComponent ],
    imports:      [ RouterModule ],
    providers:    [],
    schemas:      [],
  }
}

@NgModule(Connect.container)
export class RootModule {}

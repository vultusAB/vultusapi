import { AccountStatusComponent } from './account.status.component'
import { NgModule } from '@angular/core'

namespace Connect {
  export const container = {
    declarations: [ AccountStatusComponent ],
    imports:      [],
    providers:    [],
    exports:      [ AccountStatusComponent ],
  }
}

@NgModule(Connect.container)
export class AccountStatusModule {}

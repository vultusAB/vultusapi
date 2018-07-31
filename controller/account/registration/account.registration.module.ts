import { RouterModule, Routes } from '@angular/router'
import { AccountRegistrationComponent } from './account.registration.component'
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

// List of routes for child
// ** Normally just containing child root
namespace Inject {
  const resolver = {}
  export const router: Routes = [
    {
      path:      '',
      component: AccountRegistrationComponent,
      pathMatch: 'full',
      resolve:   resolver,
    },
  ]
}

namespace Connect {
  export const container = {
    declarations: [ AccountRegistrationComponent ],
    imports:      [ RouterModule.forChild(Inject.router) ],
    providers:    [],
    exports:      [ AccountRegistrationComponent ],
  }
}

@NgModule(Connect.container)
export class AccountRegistrationModule {}

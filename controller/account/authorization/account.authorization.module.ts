import { RouterModule, Routes } from '@angular/router'
import { AccountAuthorizationComponent } from './account.authorization.component'
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

// List of routes for child
// ** Normally just containing child root
namespace Inject {
  const resolver = {}
  export const router: Routes = [
    {
      path:      '',
      component: AccountAuthorizationComponent,
      pathMatch: 'full',
      resolve:   resolver,
    },
  ]
}

namespace Connect {
  export const container = {
    declarations: [ AccountAuthorizationComponent ],
    imports:      [ RouterModule.forChild(Inject.router) ],
    providers:    [],
    exports:      [ AccountAuthorizationComponent ],
  }
}

@NgModule(Connect.container)
export class AccountAuthorizationModule {}

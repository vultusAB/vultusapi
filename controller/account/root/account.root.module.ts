import { CanActivate, RouterModule, Routes } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
  SignOutResolver,
  SessionGuest, // eslint-disable-line
  SessionResolver,
  CreatedResolver,
} from './account.root.resolve'
import { AccountAuthorizationComponent } from '../authorization/account.authorization.component'
import { AccountStatusComponent } from '../status/account.status.component'
import { AccountRootComponent } from './account.root.component' // eslint-disable-line
import { AccountRegistrationComponent } from '../registration/account.registration.component' // eslint-disable-line
import { AccountRegisterionGuardService as RegisterGuard } from '../../../service/account-guard.service'
import { BrowserModule } from '@angular/platform-browser' // eslint-disable-line
import { NgModule } from '@angular/core'
import { SharedModule } from '../../shared.module'

// List of routes for child
// ** Normally just containing child root
namespace Inject {
  const resolver = {}
  export const router: Routes = [
    {
      path:      'account',
      component: AccountRootComponent,
      resolve:   resolver,
      children:  [
        {
          path:       '',
          redirectTo: 'signin',
          pathMatch:  'full',
        },
        {
          path:        'signin',
          component:   AccountAuthorizationComponent,
          canActivate: [ RegisterGuard ],
        },
        {
          path:        'signup',
          component:   AccountRegistrationComponent,
          canActivate: [ RegisterGuard ],
        },
        {
          path:      'signout',
          component: AccountStatusComponent,
          resolve:   {
            session: SessionGuest,
            signout: SignOutResolver,
          },
        },
        {
          path:      'status',
          component: AccountStatusComponent,
          resolve:   {
            session: SessionResolver,
          },
        },
        {
          path:      'created/signin',
          component: AccountStatusComponent,
          resolve:   {
            session: SessionResolver,
            created: CreatedResolver,
          },
        },
        {
          path:      'created',
          component: AccountStatusComponent,
          resolve:   {
            session: SessionResolver,
            signout: SignOutResolver,
            created: CreatedResolver,
          },
        },
      ],
    },
  ]
}

namespace Connect {
  export const container = {
    declarations: [
      AccountAuthorizationComponent,
      AccountRegistrationComponent,
      AccountStatusComponent,
    ],
    imports: [
      RouterModule.forChild(Inject.router),
      SharedModule,
      FormsModule,
      ReactiveFormsModule,
    ],
    providers: [
      SessionResolver,
      SessionGuest,
      SignOutResolver,
      CreatedResolver,
      RegisterGuard,
    ],
    bootstrap: [],
    exports:   [ RouterModule ],
  }
}

@NgModule(Connect.container)
export class AccountRootModule {}

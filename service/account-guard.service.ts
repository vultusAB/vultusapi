import { CanActivate, Router } from '@angular/router'
import { AuthService } from './auth.service'
import { Injectable } from '@angular/core'

@Injectable()
export class AccountRegisterionGuardService implements CanActivate {
  constructor (public auth: AuthService, public router: Router) {}

  async canActivate () {
    const prefix = 'account-guard.canActivate()'

    if (await this.auth.isAuthenticated()) {
      this.router.navigate([ '/account/status' ])
      return false
    }

    return true
  }
}

@Injectable()
export class AccountGuardService implements CanActivate {
  constructor (public auth: AuthService, public router: Router) {}

  async canActivate () {
    const prefix = 'account-guard.canActivate()'

    if (!await this.auth.isAuthenticated()) {
      this.router.navigate([ '/account/status' ])
      return false
    }

    return true
  }
}

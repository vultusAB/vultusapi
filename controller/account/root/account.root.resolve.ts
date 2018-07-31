import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router'
import { AuthService } from '../../../service/auth.service'
import { Injectable } from '@angular/core'

@Injectable()
export class SessionResolver implements Resolve<Object> {
  constructor (private authService: AuthService) {}

  resolve (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> | any {
    const prefix = 'status.account.resolver()'

    return this.authService.account
      .session()
      .then(session => {
        return {
          authenticated: session.userCtx.name !== null,
          account:       {
            name: session.userCtx.name,
          },
        }
      })
      .catch(err => console.warn(prefix, err))
  }
}

@Injectable()
export class SessionGuest implements Resolve<Object> {
  constructor () {}

  resolve (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> | any {
    const prefix = 'status.account.resolver()'

    return {
      authenticated: false,
      account:       {
        name: null,
      },
    }
  }
}

@Injectable()
export class SignOutResolver implements Resolve<Object> {
  constructor (private authService: AuthService) {}

  resolve (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> | any {
    const prefix = 'status.account.signout.resolver()'

    return this.authService.account
      .signOut()
      .catch(err => console.warn(prefix, err))
  }
}

@Injectable()
export class CreatedResolver implements Resolve<Object> {
  constructor (private authService: AuthService) {}

  resolve (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> | any {
    const prefix = 'status.account.create.resolver()'

    return true
  }
}

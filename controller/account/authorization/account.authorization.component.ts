import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../../service/auth.service'
import { Component } from '@angular/core'
import { LazyFormService } from '../../../service/lazyform.service'
import { Router } from '@angular/router'

const template = require('./assets/template.html')
const style = require('./assets/styles.scss')

namespace Handler {
  export const container = {
    selector: 'account-authorization',
    template: template,
    styles:   [ style ],
  }
}
namespace Helpers {
  export let auth
  export let form
}

@Component(Handler.container)
export class AccountAuthorizationComponent {
  private accountForm: FormGroup
  private credentialsInvalid = false

  constructor (
    private authService: AuthService,
    private lazyFormService: LazyFormService,
    private builder: FormBuilder,
    private router: Router
  ) {
    [ Helpers.auth, Helpers.form ] = [ authService, lazyFormService ]
    this.accountForm = builder.group(Helpers.form.doMagic({
        username:   [ '', Validators.email ],
        password:   [ '', Validators.required ],
        rememberme: [ 1 ],
      }))
  }

  onSubmit () {
    Helpers.auth.account
      .signIn(this.accountForm.value.username, this.accountForm.value.password)
      .then(data => {
        this.router.navigate([ '/account/status' ])
        return true
      })
      .catch(error => {
        this.credentialsInvalid = error.status === 401
        if (error.status !== 401)
          console.error('account.authorization.onSubmit()', error)
      })
  }
}

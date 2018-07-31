import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { AuthService } from '../../../service/auth.service'
import { Component } from '@angular/core'
import { LazyFormService } from '../../../service/lazyform.service'
import { Router } from '@angular/router'

const template = require('./assets/template.html')
const style = require('./assets/styles.scss')

namespace Handler {
  export const container = {
    selector: 'account-registration',
    template: template,
    styles:   [ style ],
  }
}

namespace Helpers {
  export let auth
  export let form
}

@Component(Handler.container)
export class AccountRegistrationComponent {
  private registrationForm: FormGroup
  private credentialsInvalid = false
  private credentials = {
    passwordMatch: null,
    usernameTaken: false,
  }
  constructor (
    private authService: AuthService,
    private lazyFormService: LazyFormService,
    private builder: FormBuilder,
    private router: Router
  ) {
    [ Helpers.auth, Helpers.form ] = [ authService, lazyFormService ]
    this.registrationForm = builder.group(Helpers.form.doMagic({
        username:        [ '', Validators.email ],
        firstname:       [ '', Validators.required ],
        surname:         [ '', Validators.required ],
        password:        [ '', [ Validators.required ] ],
        confirmPassword: [ '', Validators.required ],
        signin:          [ 1 ],
      }))
  }
  private matchPasswordTrigger = false
  matchPasswordValidator (source, target) {
    if (source.length === target.length || this.matchPasswordTrigger) {
      this.credentials.passwordMatch = source === target
      this.matchPasswordTrigger = true
    }
  }

  clearUsernameTaken () {
    this.credentials.usernameTaken = false
  }

  onSubmit () {
    const prefix = 'account.registration.onSubmit()'

    const meta = {
      firstname: this.registrationForm.value.firstname,
      surname:   this.registrationForm.value.surname,
      emails:    [ this.registrationForm.value.username ],
    }
    Helpers.auth.account
      .signUp(
        this.registrationForm.value.username,
        this.registrationForm.value.password,
        meta
      )
      .then(data => {
        if (this.registrationForm.value.signin) this.signIn()
        else this.router.navigate([ '/account/created' ])
        return true
      })
      .catch(error => {
        this.credentials.usernameTaken = error.status === 409
        this.credentialsInvalid = error.status === 401
        if (error.status !== (401 || 409)) console.error(prefix, error)
      })
  }

  signIn () {
    const prefix = 'account.registration.onSubmit.signIn()'
    Helpers.auth.account
      .signIn(
        this.registrationForm.value.username,
        this.registrationForm.value.password
      )
      .then(data => {
        this.router.navigate([ '/account/created/signin' ])
        return true
      })
      .catch(error => {
        console.error(prefix, error)
      })
  }
}

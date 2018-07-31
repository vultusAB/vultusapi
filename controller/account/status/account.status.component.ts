import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AuthService } from '../../../service/auth.service'
import { FormGroup } from '@angular/forms'

import { LazyFormService } from '../../../service/lazyform.service'

const template = require('./assets/template.html')
const style = require('./assets/styles.scss')

namespace Handler {
  export const container = {
    selector: 'account-status',
    template: template,
    styles:   [ style ],
  }
}
namespace Helpers {
  export let auth
  export let form
}

@Component(Handler.container)
export class AccountStatusComponent implements OnInit {
  private prefix = 'account.status.component()'
  private accountForm: FormGroup
  private credentialsInvalid = false

  private resolved

  private signout = false
  private created = false

  constructor (
    private route: ActivatedRoute,
    private authService: AuthService,
    private lazyFormService: LazyFormService
  ) {
    [ Helpers.auth, Helpers.form ] = [ authService, lazyFormService ]
  }

  ngOnInit () {
    this.resolved = this.route.snapshot.data

    this.signout = 'signout' in this.resolved
    this.created = 'created' in this.resolved
  }
}

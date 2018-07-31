import { Component } from '@angular/core'

const template = require('./assets/template.html')
const style = require('./assets/styles.scss')

namespace Handler {
  export const container = {
    selector: 'root-body',
    template: template,
    styles:   [ style ],
  }
}

@Component(Handler.container)
export class RootComponent {}

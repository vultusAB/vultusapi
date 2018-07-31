import { Component, OnInit } from '@angular/core'

const template = require('./assets/template.html')
const style = require('./assets/styles.scss')

namespace Handler {
  export const container = {
    selector: 'home-root',
    template: template,
    styles:   [ style ],
  }
}
@Component(Handler.container)
export class HomeComponent implements OnInit {
  ngOnInit () {}
}

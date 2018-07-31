import { IndexModule } from './index.module'
import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

// Fill body element
const body = require('./index.html')

const bundle = document.body.innerHTML
document.body.innerHTML = body + bundle

// document.domain = 'vultus.io'

// document.documentElement.style.height = '100%'
// document.documentElement.style.width = '100%'
// document.body.style.height = '100%'
// document.body.style.width = '100%'

enableProdMode()

platformBrowserDynamic()
  .bootstrapModule(IndexModule)
  .catch(err => console.log(err))

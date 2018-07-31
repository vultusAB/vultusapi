import { RouterModule, Routes } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { ProductSelectorFieldComponent } from './product.selector.field.component'
import { SharedModule } from '../../../shared.module'

namespace Inject {
  const resolver = {}
  export const router: Routes = [
    {
      path:      '',
      component: ProductSelectorFieldComponent,
      pathMatch: 'full',
      resolve:   resolver,
    },
  ]
}
namespace Connect {
  export const container = {
    declarations: [ ProductSelectorFieldComponent ],
    imports:      [ RouterModule.forChild(Inject.router), SharedModule ],
    providers:    [],
    bootstrap:    [],
    exports:      [ ProductSelectorFieldComponent ],
  }
}

@NgModule(Connect.container)
export class ProductSelectorFieldModule {}

import { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core'

import { ProductFieldSelectorComponent } from './product.field.selector.component'
import { SharedModule } from '../../shared.module'

namespace Inject {
  const resolver = {}
  export const router: Routes = [
    {
      path:      '',
      component: ProductFieldSelectorComponent,
      pathMatch: 'full',
      resolve:   resolver,
    },
  ]
}
namespace Connect {
  export const container = {
    declarations: [ ProductFieldSelectorComponent ],
    imports:      [ RouterModule.forChild(Inject.router), SharedModule ],
    providers:    [],
    bootstrap:    [],
    exports:      [ ProductFieldSelectorComponent ],
  }
}

@NgModule(Connect.container)
export class ProductFieldSelectorModule {}

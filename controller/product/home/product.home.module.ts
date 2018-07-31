import { RouterModule, Routes } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { ProductHomeComponent } from './product.home.component'

// List of routes for child
// ** Normally just containing child root
namespace Inject {
  const resolver = {}
  export const router: Routes = [
    {
      path:      '',
      component: ProductHomeComponent,
      pathMatch: 'full',
      resolve:   resolver,
    },
  ]
}

namespace Connect {
  export const container = {
    declarations: [ ProductHomeComponent ],
    imports:      [ RouterModule.forChild(Inject.router) ],
    providers:    [],
    exports:      [ ProductHomeComponent ],
  }
}

@NgModule(Connect.container)
export class ProductHomeModule {}

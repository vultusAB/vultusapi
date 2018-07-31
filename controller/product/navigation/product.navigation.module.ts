import { NgModule } from '@angular/core'
import { ProductNavigationComponent } from './product.navigation.component'

namespace Connect {
  export const container = {
    declarations: [ ProductNavigationComponent ],
    imports:      [],
    providers:    [],
    exports:      [ ProductNavigationComponent ],
  }
}

@NgModule(Connect.container)
export class ProductNavigationModule {}

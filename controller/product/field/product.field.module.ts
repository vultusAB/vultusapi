import { NgModule } from '@angular/core'
import { ProductFieldComponent } from './product.field.component'

// List of routes for child
// ** Normally just containing child root

namespace Connect {
  export const container = {
    declarations: [ ProductFieldComponent ],
    imports:      [],
    providers:    [],
    exports:      [ ProductFieldComponent ],
  }
}

@NgModule(Connect.container)
export class ProductFieldModule {}

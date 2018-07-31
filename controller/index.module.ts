import { NgModule, Provider } from '@angular/core'
import { APP_BASE_HREF } from '@angular/common'

import { AccountRootComponent } from './account/root/account.root.component'
import { AccountRootModule } from './account/root/account.root.module'
import { BrowserModule } from '@angular/platform-browser'
import { ClarityModule } from '@clr/angular'
import { HomeComponent } from './home/home.component'
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { ProductRootComponent } from './product/root/product.root.component'
import { ProductRootModule } from './product/root/product.root.module'
import { RootComponent } from './root/root.component'
import { RootModule } from './root/root.module'
import { RouterModule } from '@angular/router'
import { SharedModule } from './shared.module'
import { routes } from './index.routing'

namespace Inject {
  export const base: Provider = { provide: APP_BASE_HREF, useValue: '/' }
}
namespace Connect {
  export const container = {
    bootstrap:    [ RootComponent ],
    declarations: [ AccountRootComponent, ProductRootComponent, HomeComponent ],
    imports:      [
      RootModule,
      BrowserModule,
      ClarityModule,
      SharedModule,
      LeafletModule.forRoot(),
      LeafletDrawModule.forRoot(),
      RouterModule.forRoot(routes),
      AccountRootModule,
      ProductRootModule,
    ],
    providers: [ Inject.base ],
    schemas:   [],
    exports:   [ AccountRootComponent, ProductRootComponent, HomeComponent ],
  }
}

@NgModule(Connect.container)
export class IndexModule {}

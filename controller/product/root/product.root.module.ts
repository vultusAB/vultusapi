import { RouterModule, Routes } from '@angular/router'
import { AccountGuardService as AccountGuard } from '../../../service/account-guard.service'
import { AssetMapComponent } from '../../asset/map/asset.map.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FieldResolver } from './product.root.resolve' // eslint-disable-line
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { MomentModule } from 'ngx-moment'
import { NgModule } from '@angular/core'
import { ProductFieldComponent } from '../field/product.field.component'
import { ProductFieldSelectorComponent } from '../field-selector/product.field.selector.component'
import { ProductHomeComponent } from '../home/product.home.component'
import { ProductNavigationComponent } from '../navigation/product.navigation.component'
import { ProductRootComponent } from './product.root.component'
import { SharedModule } from '../../shared.module'

// List of routes for child
// ** Normally just containing child root
namespace Inject {
  const resolver = {}
  export const router: Routes = [
    {
      path:      'product',
      component: ProductRootComponent,
      resolve:   resolver,
      children:  [
        {
          path:       '',
          redirectTo: 'home',
          pathMatch:  'full',
        },
        {
          path:        'field/select',
          component:   ProductFieldSelectorComponent,
          canActivate: [ AccountGuard ],
        },
        {
          path:        'field/:id',
          component:   ProductFieldComponent,
          canActivate: [ AccountGuard ],
          resolve:     {
            field: FieldResolver,
          },
        },
        {
          path:        'home',
          component:   ProductHomeComponent,
          canActivate: [ AccountGuard ],
        },
        {
          path:       '*',
          redirectTo: 'home',
        },
      ],
    },
  ]
}

namespace Connect {
  export const container = {
    declarations: [
      AssetMapComponent,
      ProductFieldComponent,
      ProductFieldSelectorComponent,
      ProductHomeComponent,
      ProductNavigationComponent,
    ],
    imports: [
      RouterModule.forChild(Inject.router),
      LeafletDrawModule,
      LeafletModule,
      MomentModule,
      BrowserAnimationsModule,
      SharedModule,
    ],
    providers: [ FieldResolver, AccountGuard ],
    bootstrap: [],
    exports:   [ AssetMapComponent, ProductNavigationComponent, RouterModule ],
  }
}

@NgModule(Connect.container)
export class ProductRootModule {}

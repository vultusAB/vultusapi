import * as _ from 'path'

import * as changeCase from 'change-case'

import { AccountRootComponent } from './account/root/account.root.component'
import { ProductRootComponent } from './product/root/product.root.component'
import { Routes } from '@angular/router'

namespace Inject {
  const src = _.resolve(__dirname)
  const root = [
    {
      path:       '',
      redirectTo: '/product/home',
      pathMatch:  'full',
    },
  ]
  const children = [
    {
      browserPath: 'product',
      localPath:   _.resolve(src, 'product', 'root', 'product.root.module'),
      component:   ProductRootComponent,
      module:      changeCase.noCase('Product Root Module'),
      lazy:        false,
    },
    {
      browserPath: 'account',
      localPath:   _.resolve(src, 'account', 'root', 'account.root.module'),
      component:   AccountRootComponent,
      module:      changeCase.noCase('Account Root Module'),
      lazy:        false,
    },
  ]

  export const routesCompile = () => {
    const compiled = children.map(child => {
      let route: {
        path: string
        loadChildren?: string
        component?: any
      }

      if (child.lazy)
        route = {
          path:         child.browserPath,
          loadChildren: `${ child.localPath }#${ changeCase.pascalCase(child.module) }`,
        }
      else if (!child.lazy)
        route = { path: child.browserPath, component: child.component }

      return route
    })

    return [ ...root, ...compiled ]
  }
}

export const routes: Routes = Inject.routesCompile()

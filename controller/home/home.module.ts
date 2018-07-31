import { RouterModule, Routes } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { HomeComponent } from './home.component'
import { NgModule } from '@angular/core'

// List of routes for child
// ** Normally just containing child root
namespace Inject {
  const resolver = {}
  export const router: Routes = [
    {
      path:      '',
      component: HomeComponent,
      pathMatch: 'full',
      resolve:   resolver,
    },
  ]
}

namespace Connect {
  export const container = {
    declarations: [ HomeComponent ],
    imports:      [ RouterModule.forChild(Inject.router) ],
    providers:    [],
    exports:      [ HomeComponent ],
  }
}

@NgModule(Connect.container)
export class HomeModule {}

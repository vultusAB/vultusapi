import { AssetMapComponent } from './asset.map.component'
import { NgModule } from '@angular/core'
import { SharedModule } from '../../shared.module'

namespace Connect {
  export const container = {
    declarations: [ AssetMapComponent ],
    imports:      [ SharedModule ],
    providers:    [],
    bootstrap:    [],
    exports:      [ AssetMapComponent ],
  }
}

@NgModule(Connect.container)
export class AssetMapModule {}

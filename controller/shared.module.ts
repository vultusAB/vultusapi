import { ClarityModule } from '@clr/angular'
import { CommonModule } from '@angular/common'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'

namespace Connect {
  export const container = {
    imports: [ ClarityModule, CommonModule, FlexLayoutModule, FormsModule ],
    exports: [ ClarityModule, CommonModule, FlexLayoutModule, FormsModule ],
  }
}

@NgModule(Connect.container)
export class SharedModule {}

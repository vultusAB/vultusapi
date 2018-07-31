import { Component, OnInit } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { LocalizationService } from '../../../service/localization.service'
import { StructService } from '../../../service/struct.service'
import { SyncService } from '../../../service/sync.service'

const template = require('./assets/template.html')
const style = require('./assets/styles.scss')

namespace Helpers {
  export let sync: SyncService
  export let sanitizer: DomSanitizer
  export let records: SafeHtml
  export let struct: StructService
  export let moment
}

namespace Handler {
  export const container = {
    selector: 'product-navigation',
    template: template,
    styles:   [ style ],
  }
}

namespace Processors {
  export const processNavigationRecords = data => {
    return data.rows.map(init => {
      return Helpers.struct.display.field(init)
    })
  }
}

@Component(Handler.container)
export class ProductNavigationComponent implements OnInit {
  // @ViewChild('tester') el: ElementRef
  /* eslint-disable comma-dangle */
  public svgImage: SafeHtml
  public records

  public adHocUpdateShit = true
  constructor (
    private route: ActivatedRoute,
    private _localizationService: LocalizationService,
    private _syncService: SyncService,
    private _structService: StructService,
    private _sanitizer: DomSanitizer
  ) {
    [ Helpers.moment, Helpers.sync, Helpers.struct, Helpers.sanitizer ] = [
      _localizationService.moment,
      _syncService,
      _structService,
      _sanitizer,
    ]
  }
  /* eslint-enable comma-dangle */
  async ngOnInit () {
    const prefix = 'nav.ngOnInit()'

    Helpers.records = Processors.processNavigationRecords(await Helpers.sync.request('field'))

    this.records = Helpers.records
  }

  ngAfterViewInit () {}

  async onAssets () {}
}

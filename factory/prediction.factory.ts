import * as Uniqid from 'uniqid'

import { Injectable } from '@angular/core'
import { LocalizationService } from '../service/localization.service'
import { PredictionService } from '../service/prediction.service'

interface Struct {
  report: {
    type: 0 | 1 | 2
    effect: 0 | 1 | 2
    valid: boolean
    caused: 'client' | 'server' | 'external'
    message: string
    data?: object
  }
  attributes: {
    timeRange: {
      offset?: number
      start: Date
      end: Date
    }
  }
  month: {
    id: string
    date: [number, number]
    log: Array<['info' | 'warn' | 'error', string, Date, Struct['report']]>
    childOf: any
    sync: boolean
    attachments: Array<Struct['attachment']>
    attributes: {
      timeRange: Struct['attributes']['timeRange']
      childOf: {
        id: string
        type: string
        attributes: {
          timeRange: Struct['attributes']['timeRange']
        }
      }
    }
  }
  attachment: {
    id: string
    date: [number, number, number, number]
    log: Array<['info' | 'warn' | 'error', string, Date, Struct['report']]>

    attributes: {
      timestamp: Date
    }
  }
  timerange: Array<Struct['year']>
  year: Array<Struct['month']>
}

@Injectable({
  providedIn: 'root',
})
export class PredictionFactory {
  private prefix = 'factory.prediction.factory.constructor()'

  public build
  public Engine
  constructor (
    private _localization: LocalizationService,
    private _prediction: PredictionService
  ) {
    [
      Helpers.localization,
      Helpers.moment,
      Helpers.intercept,
      this.build,
      this.Engine
    ] = [
      _localization,
      _localization.moment,
      _prediction['intercept'],
      Build,
      Engine,
    ]
  }
}

namespace View {
  const tmp = {
    type: 'Root list',
    list: [
      {
        type:     'Authenticated Users',
        selected: false,
        expanded: true,
        rights:   [
          {
            name:   'Read',
            enable: true,
          },
          {
            name:   'Modify',
            enable: false,
          },
        ],
      },
    ],
  }
  export const forRequest = (block, name) => {
    const prefix = 'prediction.factory.view.forRequest()'

    const list = block.children
      .map(record => {
        return {
          type:       `${ record.name }`,
          selected:   false,
          expanded:   false,
          attributes: record.attributes,
          rights:     [],
        }
      })
      .map((record, key) => {
        const child = {
          rights: block.timeRange[key].map((row, rowKey) => {
            return {
              name: Helpers.moment
                .grab()
                .month(row.date[1] - 1)
                .format('MMMM'),
              enable:     row.sync,
              attributes: {
                path:    [ key, rowKey ],
                date:    row.date,
                childOf: row.attributes.childOf,
              },
            }
          }),
        }
        return Object.assign(record, child)
      })

    list.reverse() // Years from Now -> Descending
    list[1].expanded = true

    return {
      name: name,
      list: list,
    }
  }

  export const forAvalible = (block, name) => {
    const prefix = 'prediction.factory.view.forAvalible()'

    const list = block.children
      .map((record, key) => {
        return {
          name:       `${ record.name }`,
          icon:       'calendar',
          expanded:   false,
          attributes: record.attributes,
          files:      [],
        }
      })
      .map((record, key) => {
        const child = {
          files: block.timeRange[key].map((row, rowKey) => {
            return {
              name: Helpers.moment
                .grab()
                .month(row.date[1] - 1)
                .format('MMMM'),
              icon:        'cloud-chart',
              sync:        row.sync,
              log:         row.log,
              attachments: row.attachments,
              attributes:  {
                path:    [ key, rowKey ],
                date:    row.date,
                childOf: row.attributes.childOf,
              },
            }
          }),
        }
        return Object.assign(record, child)
      })

    list.reverse() // Years from Now -> Descending
    list[1].expanded = true // Open current year

    return {
      name: name,
      list: list,
    }
  }
}

namespace Adapter {
  export const version = () => {
    return '12.1'
  }
  export const populate = parent => {
    return Build.datablock(parent)
  }

  export class Tunnel {
    public version
    public populate
    constructor () {
      [ this.version, this.populate ] = [ Adapter.version, Adapter.populate ]
    }
  }
}

class Engine extends Adapter.Tunnel {
  private block
  private prefix = 'prediction.factory.engine'
  constructor (parent: { id: string; type: string; name: string }) {
    super()
    const struct = this.populate(parent)
    this.block = {
      root: struct,
      for:  {
        requestView:  false, // View.forRequest(struct.data, 'Time list'),
        avalibleView: false, // View.forAvalible(struct.data, 'Time list'),
      },
    }
  }

  public getBlock () {
    return this.block
  }
}

namespace Build {
  export const datablock = (parent: {
    id: string
    type: string
    name: string
  }) => {
    const offset = 10
    const fromYear = 2000
    const timeRange = Build.timerange(offset, fromYear, parent)
    return {
      id:   Uniqid(),
      data: {
        name:      'Time range',
        timeRange: timeRange,
        children:  timeRange.map((val, key) => {
          const timespan = Helpers.moment
            .grab()
            .year(fromYear + offset + 1)
            .add(key, 'years')
          return {
            name:       timespan.year(),
            attributes: {
              timeRange: {
                start: timespan.startOf('year').toISOString(),
                end:   timespan.endOf('year').toISOString(),
              },
            },
          }
        }),
      },
      attributes: {
        timeRange: {
          start: Helpers.moment
            .grab()
            .year(fromYear + offset)
            .startOf('year')
            .toISOString(),
          end: Helpers.moment
            .grab()
            .add(8, 'months')
            .endOf('months')
            .toISOString(),
          offset: offset,
        },
        fromYear: fromYear + offset,
        childOf:  parent,
      },
    }
  }
  export const timerange = (
    offset: number = 3,
    fromYear: number = 2000,
    parent
  ): Struct['timerange'] => {
    const year = fromYear + offset

    const range
      = Helpers.moment
        .grab()
        .add(8, 'months')
        .year() - year

    return Array(range)
      .fill(1)
      .map((intendYear, yearOffset) =>
        Build.year(year + intendYear + yearOffset, 12, parent))
  }
  export const year = (year: number, monthsInYear: number = 12, parent) => {
    const month = 0
    const id = Uniqid()
    return Array(monthsInYear)
      .fill(1)
      .map((firstMonthOfYear, monthOffset) =>
        Helpers.intercept(Build.month(id, year, month + firstMonthOfYear + monthOffset, parent)))
  }
  export const month = (
    parentId,
    year: number,
    month,
    owner
  ): Struct['month'] => {
    return {
      id:          Uniqid(),
      date:        [ year, month ],
      sync:        false,
      childOf:     owner,
      attachments: [],
      attributes:  {
        timeRange: {
          start: Helpers.moment
            .grab()
            .year(year)
            .month(month - 1)
            .startOf('month')
            .toISOString(),
          end: Helpers.moment
            .grab()
            .year(year)
            .month(month - 1)
            .endOf('month')
            .toISOString(),
        },
        childOf: {
          id:         parentId,
          type:       'timerange',
          attributes: {
            timeRange: {
              start: Helpers.moment
                .grab()
                .year(year)
                .startOf('year')
                .toISOString(),
              end: Helpers.moment
                .grab()
                .year(year)
                .endOf('year')
                .toISOString(),
            },
          },
        },
      },
      log: [],
    }
  }
  export const attachment = (
    timestamp: Date,
    year: number,
    month: number,
    weekOfMonth: number,
    dayOfMonth: number
  ) => {
    return {
      id:         Uniqid(),
      date:       [ year, month, weekOfMonth, dayOfMonth ],
      log:        [],
      attributes: {
        timestamp: timestamp,
      },
    }
  }
}

namespace Processors {

}

namespace Helpers {
  export let localization: LocalizationService
  export let moment: LocalizationService['moment']
  export let intercept: PredictionService['intercept']
}

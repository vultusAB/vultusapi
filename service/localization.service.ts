import 'moment/locale/en-gb'

import * as castTo from 'change-case'
import * as moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022'
import * as uniq from 'array-uniq'

import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  public local
  public moment
  constructor () {
    [ this.local, this.moment ] = [ Helpers.localization, Moment ]

    const prefix = 'constructor.LocalizationService()'

    Moment.configure()
  }
}

namespace Helpers {
  const navi: any = window.navigator
  export const localization = {
    timezone: {
      name:    moment.tz.guess(),
      abbrs:   uniq(moment.tz.zone(moment.tz.guess()).abbrs),
      offsets: uniq(moment.tz.zone(moment.tz.guess()).offsets),
    },
    i18n: {
      type:  navi.language,
      types: navi.languages,
    },
    meta: {
      userAgent: navi.userAgent || false,
      browser:   {
        name:  navi.appCodeName || false,
        build: navi.buildID || false,
      },
      platform: {
        name: navi.platform || false,
      },
    },
  }
}

export namespace Moment {
  const struct = moment()
  export const configure = (
    timezone = Helpers.localization.timezone.name,
    i18n = Helpers.localization.i18n.type
  ) => {
    struct.tz(timezone)
    struct.locale(i18n)
  }
  export const grab = (datetime = Date.now()) => {
    return struct.clone().set(datetime)
  }
  export const toString = (datetime = Date.now()) => {
    return Moment.grab(datetime).format()
  }
  export const fromUTC = datetime => {
    return Moment.grab(datetime).format()
  }
  export const toUTC = datetime => {
    return Moment.grab()
      .parseZone(datetime)
      .utc()
      .format()
  }
}

import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterEvent,
  RouterStateSnapshot,
} from '@angular/router'
import { Injectable } from '@angular/core'
import { StructService } from '../../../service/struct.service'
import { SyncService } from '../../../service/sync.service'

@Injectable()
export class FieldResolver implements Resolve<Object> {
  constructor (
    private syncService: SyncService,
    private structService: StructService
  ) {}

  resolve (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> | any {
    const prefix = 'field.resolver()'
    console.log(prefix, `Target: field-${ route.params['id'] }`)
    return this.syncService
      .request('field', route.params['id'])
      .then(result => {
        console.log(prefix, result)
        return result.rows.map(init => {
          return this.structService.display.field(init)
        })[0]
      })
      .catch(error => {
        console.error(prefix, error)
        return error
      })
  }
}

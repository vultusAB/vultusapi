import assert from 'assert';
import diff from '../index';
import config from './config.json';

describe('array diff ', function () {
    config.forEach(con => {
        it('test', () => {
            const res = diff(con.array1, con.array2);
            assert.deepEqual(res, con.result, `expected ${con.result} actual ${res}`)
        })
    })

})
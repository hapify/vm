import { expect } from '@hapi/code';
import * as Lab from '@hapi/lab';
const lab = (exports.lab = Lab.script());

import { HapifyVM } from "../index";

lab.test('convert path with name', async () => {
    new HapifyVM().run('process.exit()', {});
});

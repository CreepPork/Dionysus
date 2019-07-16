import * as jQuery from 'jquery';

import { AxiosStatic } from 'axios';
import { LoDashStatic } from 'lodash';
import Popper from 'popper.js';

export { };

declare global {
    // tslint:disable-next-line: interface-name
    interface Window {
        Popper: Popper;
        axios: AxiosStatic;
        _: LoDashStatic;
        $: JQueryStatic;
        jQuery: JQueryStatic;
    }
}

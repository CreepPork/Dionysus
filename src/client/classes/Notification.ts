import * as Cfx from 'fivem-js';

import Delay from '../../shared/utilities/Delay';
import { EDialogKeyType } from '../enums/EDialogKeyType';
import { EInstructionalButtonType } from '../enums/EInstructionalButtonType';

export default class Notification {
    public static DisplayHelp() {
        //
    }

    public static DisplayNotification() {
        //
    }

    public static DisplaySubtitle() {
        //
    }

    /**
     * Creates a fullscreen display with `Alert` type dialog.
     * Example: https://imgur.com/imwoimm
     *
     * Allowing none of the 3 keys will result in an **infinite loop**.
     *
     * @param messages Each line to display to the user. **Maximum is 2 lines**.
     * @param key Instructional keys to display.
     * @param isSelectedAllowed Defines if the user can press FrontendAccept or FrontendSelect to close the dialog.
     * @param isAlternateAllowed Defines if the user can press FrontendX (spacebar) to close the display.
     * @param isCancelAllowed Defines if the user can press FrontendCancel to close the display.
     * @param keyPressCallback Once the key gets pressed or the user interacts with one of the controls then execute.
     */
    public static async DisplayWarning(
        firstLine: string,
        secondLine = '',
        key: EInstructionalButtonType,
        isSelectedAllowed: boolean,
        isAlternateAllowed: boolean,
        isCancelAllowed: boolean,
        // tslint:disable-next-line: no-empty
        keyPressCallback: (key: EDialogKeyType) => void = () => {},
    ) {

        while (true) {
            await Delay(5);

            SetWarningMessage(firstLine, key, secondLine, false, -1, true, 0);

            if (isSelectedAllowed) {
                if (Cfx.Game.isControlJustReleased(2, Cfx.Control.FrontendAccept) ||
                    Cfx.Game.isControlJustReleased(2, Cfx.Control.FrontendSelect)) {
                        keyPressCallback(EDialogKeyType.Selected);
                        break;
                }
            } else if (isAlternateAllowed) {
                if (Cfx.Game.isControlJustReleased(2, Cfx.Control.FrontendX)) {
                    keyPressCallback(EDialogKeyType.Alternate);
                    break;
                }
            } else if (isCancelAllowed) {
                if (Cfx.Game.isControlJustReleased(2, Cfx.Control.FrontendCancel)) {
                    keyPressCallback(EDialogKeyType.Cancel);
                    break;
                }
            }
        }
    }
}

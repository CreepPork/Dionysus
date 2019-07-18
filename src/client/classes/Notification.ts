import { EInstructionalButtonType } from "../enums/EInstructionalButtonType";
import { EDialogKeyType } from "../enums/EDialogKeyType";

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
     * @param messages Each line to display to the user. **Maximum is 2 lines**.
     * @param key Instructional keys to display.
     * @param keyPressCallback Once the key gets pressed or the user interacts with one of the controls then execute.
     */
    public static DisplayWarning(
        messages: string[],
        key: EInstructionalButtonType,
        // tslint:disable-next-line: no-empty
        keyPressCallback: (key: EDialogKeyType) => void = () => {},
    ) {

        for (const message of messages) {
            //
        }

        // AddTextEntry('warning_message_first_line')

//         -- Make the first line using custom text.
// AddTextEntry("warning_message_first_line", "This is the first line.")

// -- Make the second line using custom text.
// AddTextEntry("warning_message_second_line", "This is the second line!")

// -- Add an event handler for when the screen is dismissed.
// AddEventHandler("optionSelected", function(selected)
//     print(selected) -- do whatever you want with the selected choice.
//     -- players can either press the physicial buttons, or they can click
//     -- the instructional buttons with their mouse and it will trigger
//     -- the event as well.
// end)


// -- Create a thread to loop this warning message.
// CreateThread(function()
//     while true do
//         Wait(0)
//         -- Display the warning message every tick.
//         SetWarningMessage("warning_message_first_line", 82, "warning_message_second_line", 0, -1, true, 0, 0, 0)

//         -- Check for key presses or instructional button clicks.
//         -- Input group of 2 is required for this to work while the warning is being displayed.

//         if (IsControlJustReleased(2, 201) or IsControlJustReleased(2, 217)) then -- any select/confirm key was pressed.
//             TriggerEvent("optionSelected", "select")
//             break
//         elseif (IsControlJustReleased(2, 203)) then -- spacebar/x on controller (alt option) was pressed.
//             TriggerEvent("optionSelected", "alt")
//             break
//         elseif (IsControlJustReleased(2, 202)) then -- any of the cancel/back buttons was pressed
//             TriggerEvent("optionSelected", "cancel")
//             break
//         end
//     end
// end)
    }
}

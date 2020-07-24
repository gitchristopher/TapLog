using System;
using System.Collections.Generic;
using System.Text;

namespace TapLog.Domain.Enums
{
    public enum TapAction
    {
        Entry,
        Exit,
        ForcedEntry,
        ForcedExit,
        Undo,
        Cancel,
        Transfer
    }
}

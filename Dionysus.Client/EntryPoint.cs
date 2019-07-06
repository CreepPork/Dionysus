using System;
using CitizenFX.Core;

namespace Dionysus.Client
{
    public class EntryPoint : BaseScript
    {
        public EntryPoint()
        {
            EventHandlers["onClientResourceStart"] += new Action(OnClientResourceStart);
        }

        private static void OnClientResourceStart()
        {
            Debug.WriteLine("Dionysus has loaded.");
        }
    }
}
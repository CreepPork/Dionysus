using System;
using CitizenFX.Core;

namespace Dionysus.Client
{
    // ReSharper disable once UnusedMember.Global
    public class Main : BaseScript
    {
        public Main()
        {
            EventHandlers["onClientResourceStart"] += new Action(OnClientResourceStart);
        }

        private static void OnClientResourceStart()
        {
            Debug.WriteLine("Dionysus has loaded.");
        }
    }
}
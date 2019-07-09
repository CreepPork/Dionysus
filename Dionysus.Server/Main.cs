using System;
using CitizenFX.Core;

namespace Dionysus.Server {
    // ReSharper disable once UnusedMember.Global
    public class Main : BaseScript {
        public Main() {
            EventHandlers["onResourceStart"] += new Action(OnResourceStart);
        }

        private static void OnResourceStart() {
            // Read JSON file for Bearer token
            Settings settings = Settings.Get();
            
            Debug.WriteLine(settings.BearerToken);
        }
    }
}
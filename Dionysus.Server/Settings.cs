using System;
using System.IO;
using Newtonsoft.Json;

// ReSharper disable UnusedAutoPropertyAccessor.Global
// ReSharper disable AutoPropertyCanBeMadeGetOnly.Global | If set from properties are removed then JSON returns them as null/false.
// ReSharper disable MemberCanBePrivate.Global | Same as above.
namespace Dionysus.Server {
    public class Settings {
        // ReSharper disable once EmptyConstructor | Required for JSON
        public Settings() { }

        public Settings(string hostUrl, string bearerToken) {
            HostUrl = hostUrl;
            BearerToken = bearerToken;
        }

        public string HostUrl { get; set; }
        public string BearerToken { get; set; }

        private static string GetPath() {
            return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "dionysus.settings.json");
        }

        private static bool Exists() {
            return File.Exists(GetPath());
        }

        private static void Initialize() {
            Settings settings = new Settings {BearerToken = "", HostUrl = ""};
            settings.Save();
        }

        public static Settings Get() {
            if (! Exists()) {
                Initialize();
            }
            
            return JsonConvert.DeserializeObject<Settings>(File.ReadAllText(GetPath()));
        }

        public void Save() {
            File.WriteAllText(
                GetPath(),
                JsonConvert.SerializeObject(this, Formatting.Indented)
            );
        }
    }
}
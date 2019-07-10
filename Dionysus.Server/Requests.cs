using RestSharp;
using RestSharp.Authenticators;

namespace Dionysus.Server {
    public class Requests {
        public static RestClient GetClient() {
            RestClient restClient = new RestClient {
                Authenticator = new OAuth2AuthorizationRequestHeaderAuthenticator(
                    Settings.Get().BearerToken
                )
            };
            
            return restClient;
        }
    }
}
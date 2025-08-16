namespace API.Config
{
    public class JwtConfig
    {
        public string Secret { get; set; } = "";
        public string Issuer { get; set; } = "";
        public string Audience { get; set; } = "";
        public int AccessTokenExpirationMinutes { get; set; } = 15;
        public int RefreshTokenExpirationDays { get; set; } = 30;
    }
}
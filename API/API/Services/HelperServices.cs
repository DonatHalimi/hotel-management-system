namespace API.Services
{
    public static class HelperServices
    {
        public static string ToPlural(this string singular)
        {
            if (string.IsNullOrEmpty(singular))
                return singular;

            if (singular.EndsWith("y") &&
                !singular.EndsWith("ay") &&
                !singular.EndsWith("ey") &&
                !singular.EndsWith("iy") &&
                !singular.EndsWith("oy") &&
                !singular.EndsWith("uy"))
            {
                return singular[..^1] + "ies";
            }

            if (singular.EndsWith("s") ||
                singular.EndsWith("x") ||
                singular.EndsWith("z") ||
                singular.EndsWith("ch") ||
                singular.EndsWith("sh"))
            {
                return singular + "es";
            }

            return singular + "s";
        }
    }
}
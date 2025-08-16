namespace API.Validations.Constants
{
    public static class UserConstants
    {
        public const string ENTITY_NAME = "user";
        public const int MAX_FIRST_NAME_LENGTH = 20;
        public const int MAX_LAST_NAME_LENGTH = 20;
        public const int MAX_EMAIL_LENGTH = 50;
        public const int MINIMUM_PASSWORD_LENGTH = 12;

        public const string AVATAR_API = "https://ui-avatars.com/api/?name=";
        public const string AVATAR_COLOR = "ffffff";
        public const string AVATAR_BACKGROUND = "007bff";
        public const int AVATAR_SIZE = 128;
    }

    public static class RoleConstants
    {
        public const string ENTITY_NAME = "role";
        public const int MAX_NAME_LENGTH = 30;
        public const int MAX_DESCRIPTION_LENGTH = 200;
        public const string DEFAULT_ROLE_NAME = "User";
    }
}
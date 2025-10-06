namespace API.Validations.Constants
{
    public static class UserConstants
    {
        public const string ENTITY_NAME = "user";

        public const int MAX_FIRST_NAME_LENGTH = 20;
        public const int MAX_LAST_NAME_LENGTH = 20;

        public const int MAX_EMAIL_LENGTH = 100;

        public const int MIN_PSW_LENGTH = 8;
        public const int MIN_PSW_COUNT = 1;

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

    public static class HotelConstants
    {
        public const string ENTITY_NAME = "hotel";
        public const int MAX_NAME_LENGTH = 100;
        public const int MAX_DESCRIPTION_LENGTH = 500;

        public const int MAX_PHONE_LENGTH = 15;

        public const int MAX_CITY_LENGTH = 50;
        public const int MAX_COUNTRY_LENGTH = 50;
        public const int MAX_PHONE_NUMBER_LENGTH = 15;
        public const int MAX_EMAIL_LENGTH = 100;
    }

    public static class RoomConstants
    {
        public const string ENTITY_NAME = "room";
        public const int MAX_ROOM_NUMBER_LENGTH = 100;

        public const int MIN_CAPACITY = 0;
        public const int MAX_CAPACITY = 15;

        public const int MIN_PRICE_PER_NIGHT = 20;
        public const int MAX_PRICE_PER_NIGHT = 5000;

        public const int MAX_NOTES_LENGTH = 500;
        public const int MIN_FLOOR_NUMBER = -5;
        public const int MAX_FLOOR_NUMBER = 200;
    }

    public static class RoomTypeConstants
    {
        public const string ENTITY_NAME = "room type";
        public const int MAX_NAME_LENGTH = 100;
        public const int MAX_DESCRIPTION_LENGTH = 500;
        public const int MAX_AMENITIES_JSON_LENGTH = 2000;

        public const int MIN_OCCUPANCY = 0;
        public const int MAX_OCCUPANCY = 20;

        public const int MIN_BED_COUNT = 0;
        public const int MAX_BED_COUNT = 10;

        public const decimal MIN_BASE_PRICE = 0;
        public const decimal MAX_BASE_PRICE = 999999.99m;

        public const decimal MIN_SIZE_SQFT = 0;
        public const decimal MAX_SIZE_SQFT = 10000;
    }

    public static class GuestConstants
    {
        public const string ENTITY_NAME = "guest";
        public const int MAX_ID_NUMBER_LENGTH = 20;
        public const int MAX_FIRST_NAME_LENGTH = 20;
        public const int MAX_LAST_NAME_LENGTH = 20;
        public const int MAX_EMAIL_LENGTH = 100;
        public const int MAX_PHONE_NUMBER_LENGTH = 15;
        public const int MAX_STREET_LENGTH = 100;
        public const int MAX_CITY_LENGTH = 50;
        public const int MAX_COUNTRY_LENGTH = 50;
    }
}
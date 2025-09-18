namespace API.Validations.Constants
{
    public static class CoreConstants
    {
        public const int MIN_PAGE_NUMBER = 1;
        // TODO: MIN_PAGE_SIZE should be changed later to account for multiple page sizes (5, 10, 25, 50, 100)
        public const int MIN_PAGE_SIZE = 10;
        public const int MAX_PAGE_SIZE = 100;
        public const int MAX_SEARCH_LENGTH = 50;

        public const int MAX_DELETE_LENGTH = 100;

        public const int MAX_DESC_LENGTH = 500;
    }
}

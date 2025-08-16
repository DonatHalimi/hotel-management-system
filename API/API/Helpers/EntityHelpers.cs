using API.Validations.Constants;
using System;

namespace API.Helpers
{
    public static class ProfilePictureHelper
    {
        public static string Generate(string firstName, string lastName)
        {
            var initials = $"{firstName[0]}{lastName[0]}";
            return $"{UserConstants.AVATAR_API}{Uri.EscapeDataString(initials)}&background={UserConstants.AVATAR_BACKGROUND}&color={UserConstants.AVATAR_COLOR}&size={UserConstants.AVATAR_SIZE}";
        }
    }
}

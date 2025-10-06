using System;
using System.Security.Cryptography;

namespace API.Services
{
    public interface IOtpService
    {
        string GenerateOtp(int length = 6);
        DateTime GetOtpExpiry(int expiryMinutes = 10);
    }

    public class OtpService : IOtpService
    {
        public string GenerateOtp(int length = 6)
        {
            if (length != 6)
                throw new ArgumentException("OTP length must be 6 digits");

            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[4];
            rng.GetBytes(bytes);

            var randomNumber = Math.Abs(BitConverter.ToInt32(bytes, 0));
            var otp = (randomNumber % (int)Math.Pow(10, length)).ToString().PadLeft(length, '0');

            return otp;
        }

        public DateTime GetOtpExpiry(int expiryMinutes = 10)
        {
            return DateTime.UtcNow.AddMinutes(expiryMinutes);
        }
    }
}
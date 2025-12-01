namespace API.Models.Enums
{
    public enum PaymentMethod
    {
        CreditCard,
        DebitCard,
        BankTransfer,
        Cash,
        MobilePayment
    }

    public enum PaymentStatus
    {
        Pending,
        Completed,
        Failed,
        Refunded
    }
}
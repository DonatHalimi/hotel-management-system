namespace API.Models.Enums
{
    public enum RoomStatus
    {
        Available,
        Occupied,
        OutOfOrder,
        Maintenance,
        Cleaning,
        Reserved
    }

    public enum RoomCondition
    {
        Excellent,
        Good,
        Fair,
        Poor
    }

    public enum BedType
    {
        Single,
        Double,
        Queen,
        King,
        TwinBeds,
        Bunk
    }
}

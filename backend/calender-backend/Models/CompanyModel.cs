public class CompanyId
{
    public int Id { get; set; }
    public string Name { get; set; } = "Name_Missing";
    public string Key { get; set; } = "Key_Missing"; // Unique key for the company
}

public class CompanyDTO
{
    public string Name { get; set; }
    public string Key { get; set; }
}
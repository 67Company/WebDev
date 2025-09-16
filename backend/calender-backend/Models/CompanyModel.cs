public class CompanyId
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Key { get; set; } // Unique key for the company
}

public class CompanyDTO
{
    public string Name { get; set; }
    public string Key { get; set; } // Unique key for the company
}
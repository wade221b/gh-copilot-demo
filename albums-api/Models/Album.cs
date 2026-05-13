namespace albums_api.Models
{
    public record Album(int Id, int Year, string Title, Artist Artist, double Price, string Image_url)
    {
        private static readonly List<Album> Albums = new()
        {
            new Album(1, 2020, "You, Me and an App Id", new Artist("Daprize", new DateTime(1988, 3, 12), "Seattle, USA"), 10.99, "https://aka.ms/albums-daprlogo"),
            new Album(2, 2019, "Seven Revision Army", new Artist("The Blue-Green Stripes", new DateTime(1986, 7, 25), "Austin, USA"), 13.99, "https://aka.ms/albums-containerappslogo"),
            new Album(3, 2021, "Scale It Up", new Artist("KEDA Club", new DateTime(1990, 1, 18), "Dublin, Ireland"), 13.99, "https://aka.ms/albums-kedalogo"),
            new Album(4, 2018, "Lost in Translation", new Artist("MegaDNS", new DateTime(1984, 11, 6), "London, UK"), 12.99, "https://aka.ms/albums-envoylogo"),
            new Album(5, 2022, "Lock Down Your Love", new Artist("V is for VNET", new DateTime(1992, 5, 30), "Toronto, Canada"), 12.99, "https://aka.ms/albums-vnetlogo"),
            new Album(6, 2020, "Sweet Container O' Mine", new Artist("Guns N Probeses", new DateTime(1987, 9, 9), "Sydney, Australia"), 14.99, "https://aka.ms/albums-containerappslogo")
        };

        public static List<Album> GetAll()
        {
            return Albums.ToList();
        }

        public static Album? GetById(int id)
        {
            return Albums.FirstOrDefault(a => a.Id == id);
        }

        public static List<Album> GetByYear(int year)
        {
            return Albums.Where(a => a.Year == year).ToList();
        }

        public static Album Create(Album album)
        {
            var newId = Albums.Count == 0 ? 1 : Albums.Max(a => a.Id) + 1;
            var created = album with { Id = newId };
            Albums.Add(created);
            return created;
        }

        public static Album? Update(int id, Album album)
        {
            var existingIndex = Albums.FindIndex(a => a.Id == id);
            if (existingIndex == -1)
            {
                return null;
            }

            var updated = album with { Id = id };
            Albums[existingIndex] = updated;
            return updated;
        }

        public static bool Delete(int id)
        {
            var existing = Albums.FirstOrDefault(a => a.Id == id);
            if (existing == null)
            {
                return false;
            }

            return Albums.Remove(existing);
        }
    }
}

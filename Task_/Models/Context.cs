using System.Data.Entity;

namespace Task_.Models
{
    public class Context : DbContext
    {
        public Context() : base("name=ContactManagerConnectionString")
        {
            Database.SetInitializer<Context>(new CreateDatabaseIfNotExists<Context>());
        }

        public DbSet<Contact> Contacts { get; set; }
    }
}
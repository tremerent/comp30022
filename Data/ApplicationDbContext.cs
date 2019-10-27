using Artefactor.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Artefactor.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {

        }

        public DbSet<Artefact> Artefacts { get; set; }
        public DbSet<ArtefactDocument> ArtefactDocuments { get; set; }
        public DbSet<ArtefactComment> ArtefactComments { get; set; }
        public DbSet<ArtefactQuestion> ArtefactQuestions { get; set; }
        
        public DbSet<Artefactor.Models.Category> Category { get; set; }
        public DbSet<Artefactor.Models.ArtefactCategory> ArtefactCategory { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // auto generated pks

            modelBuilder.Entity<Category>()
                .Property(c => c.Id)
                .HasDefaultValue("NEWID()");

            modelBuilder.Entity<Artefact>()
                .Property(c => c.Id)
                .HasDefaultValue("NEWID()");

            modelBuilder.Entity<ArtefactDocument>()
                .Property(c => c.Id)
                .HasDefaultValue("NEWID()");

            modelBuilder.Entity<ArtefactComment>()
                .Property(c => c.Id)
                .HasDefaultValue("NEWID()");

            // Artefact - category many-many

            modelBuilder.Entity<ArtefactCategory>()
                        .HasKey(at => new { at.ArtefactId, at.CategoryId });
            modelBuilder.Entity<ArtefactCategory>()
                        .HasOne(ac => ac.Category)
                        .WithMany(c => c.ArtefactJoin)
                        .HasForeignKey(ac => ac.CategoryId);
            modelBuilder.Entity<ArtefactCategory>()
                        .HasOne(ac => ac.Artefact)
                        .WithMany(c => c.CategoryJoin)
                        .HasForeignKey(ac => ac.ArtefactId);

            // artefact - artefact documents
            modelBuilder.Entity<Artefact>()
                .HasMany(a => a.Images)
                .WithOne(ad => ad.Artefact);

            // artefact - artefact comments
            modelBuilder.Entity<Artefact>()
                .HasMany(a => a.Comments)
                .WithOne(ac => ac.Artefact);

            modelBuilder.Entity<ArtefactComment>()
                .HasDiscriminator<string>("CommentType");
        }
    }
}

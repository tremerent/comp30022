using Artefactor.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
        }

        public DbSet<Artefactor.Models.Category> Category { get; set; }

        public DbSet<Artefactor.Models.ArtefactCategory> ArtefactCategory { get; set; }
    }
}

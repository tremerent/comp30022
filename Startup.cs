using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Artefactor.Data;
using Artefactor.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;

namespace Artefactor
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    //Configuration.GetConnectionString("DefaultConnection")));
            Configuration.GetConnectionString("AzureDbConnection")));

            //services
            //    .AddDefaultIdentity<ApplicationUser>(options => {
            //        // <https://stackoverflow.com/a/27831598>
            //        // Needlessly complex password validation rules do not
            //        // meaningfully increase entropy and usually cause
            //        // users to resort to password reuse in order to remember
            //        // logins, thus substantially *reducing* the effective
            //        // security.
            //        // - Sam
            //        options.Password.RequireDigit = false;
            //        options.Password.RequireLowercase = false;
            //        options.Password.RequireUppercase = false;
            //        options.Password.RequireNonAlphanumeric = false;
            //        options.Password.RequiredLength = 10;
            //    })
            //    .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            //services.AddIdentityServer()
            //    .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            //var certificate = new X509Certificate2(certificateFilePath, "test");

            services.AddIdentityServer()
                .AddDeveloperSigningCredential()  // DEFINTELY DON'T REMOVE THIS W/O KNOWING WHAT IT DOES - :(
                .AddInMemoryPersistedGrants()
                .AddInMemoryIdentityResources(TokenAuth.Config.GetIdentityResources())
                .AddInMemoryApiResources(TokenAuth.Config.GetApiResources())
                .AddInMemoryClients(TokenAuth.Config.GetClients())
                .AddAspNetIdentity<ApplicationUser>();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    // base-address of your identityserver
                    options.Authority = "http://localhost:44377/";

                    // name of the API resource
                    options.Audience = "artefactorapi";

                    options.RequireHttpsMetadata = false;
                });


            services.AddMvc(options => options.EnableEndpointRouting = false)
                    .AddNewtonsoftJson(options =>
                    {
                        options.SerializerSettings.ReferenceLoopHandling =
                            Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                    });

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseIdentityServer();
            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}

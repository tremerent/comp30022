using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Artefactor.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Bio { get; set; }
        public string ImageUrl { get; set; }
    }
}

using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Artefactor.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string ArtefactCount { get; set; }
        public string Biography { get; set; }
    }
}

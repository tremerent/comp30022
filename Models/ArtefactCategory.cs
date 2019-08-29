using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Artefactor.Models
{
    public class ArtefactCategory
    {
        public string ArtefactId { get; set; }
        public Artefact Artefact { get; set; }
        public string CategoryId { get; set; }
        public Category Category { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Artefactor.Models
{
    public class Artefact
    {
        public string ArtefactId { get; set; }
        public Genre Genre { get; set; }
        public string Name { get; set; }
    }

    public enum Genre
    {
        ART,
        LITERATURE
    }
}

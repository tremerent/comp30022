﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Artefactor.Models
{
    public class Category
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<ArtefactCategory> ArtefactJoin { get; set; }
    }
}

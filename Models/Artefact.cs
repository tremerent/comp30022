using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Artefactor.Models
{
    public class Artefact
    {
        public string Id { get; set; }
        public IEnumerable<ArtefactCategory> CategoryJoin { get; set; }
        public string Name { get; set; }
    }

    [Flags]
    public enum Genre
    {
        // hacky fix for serializing json enum 
        // - I think this can be fixed by creating applying a custom model
        // that using JSON.net to serialize instead, but it seems not worth
        // doing:
        // https://stackoverflow.com/questions/28187150/json-net-stringenumconverter-not-always-working
        // - Jonah
        Art = 0,
        Literature = 1,
    }
}

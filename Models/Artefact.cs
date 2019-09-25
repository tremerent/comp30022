using System.Collections.Generic;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Artefactor.Models
{
    public class Artefact
    {
        public string Id { get; set; }
        public IEnumerable<ArtefactCategory> CategoryJoin { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public Visibility Visibility { get; set; }
        public ApplicationUser Owner { get; set; }
    }

    public enum Visibility
    {
        [EnumMember(Value = "private")]
        Private,
        [EnumMember(Value = "family")]
        PrivateFamily,
        [EnumMember(Value = "public")]
        Public,
    }
    
}

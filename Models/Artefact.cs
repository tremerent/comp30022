using System.Collections.Generic;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Artefactor.Models
{
    public class Artefact
    {
        public string Id { get; set; }
        [JsonRequired]
        public string Title { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        [JsonRequired]
        public Visibility Visibility { get; set; }
        [JsonRequired]
        public string Description { get; set; }
        public System.DateTime CreatedAt { get; set; }

        public IEnumerable<ArtefactCategory> CategoryJoin { get; set; }
        public IEnumerable<ArtefactDocument> Images { get; set; }
        public IEnumerable<ArtefactComment> Comments { get; set; }

        public string OwnerId { get; set; }
        public ApplicationUser Owner { get; set; }
    }

    public enum Visibility
    {
        Unspecified = 0,  // default to unspecified
        [EnumMember(Value = "private")]
        Private = 1,
        [EnumMember(Value = "family")]
        PrivateFamily = 2,
        [EnumMember(Value = "public")]
        Public = 3,
    }

}

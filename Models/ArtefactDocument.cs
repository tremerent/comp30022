using System.Runtime.Serialization;

namespace Artefactor.Models
{
    public class ArtefactDocument
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public DocType DocType { get; set; }
        public string ArtefactId { get; set; }
        public Artefact Artefact { get; set; }
    }

    public enum DocType
    {
        Unspecified = 0,
        [EnumMember(Value = "image")]
        Image = 1,  // default to unspecified
        [EnumMember(Value = "file")]
        File = 2
    }
}

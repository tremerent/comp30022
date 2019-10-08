using System.Collections.Generic;

namespace Artefactor.Models
{
    public class ArtefactComment
    {
        public string Id { get; set; }
        public string Body { get; set; }

        public string AuthorId { get; set; }
        public ApplicationUser Author { get; set; }

        public string ArtefactId { get; set; }
        public Artefact Artefact { get; set; }

        public string ParentCommentId { get; set; }
        public ArtefactComment ParentComment { get; set; }
        public IEnumerable<ArtefactComment> ChildComments { get; set; }
    }
}

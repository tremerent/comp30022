namespace Artefactor.Models
{
    public class ArtefactQuestion : ArtefactComment
    {
        public bool IsAnswered { get; set; }
        public string AnswerCommentId { get; set; }
        public ArtefactComment AnswerComment { get; set; }
    }
}

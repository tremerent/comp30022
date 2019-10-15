using System.Collections.Generic;
using System.Linq;

using Artefactor.Models;

namespace Artefactor.Services.Converters
{
    public class ArtefactCommentConverter : IConverter<ArtefactComment>
    {
        public object ToJson(ArtefactComment c)
        {
            IEnumerable<object> childJson = null;
            if (c.ChildComments != null)
            {
                childJson = c.ChildComments.Select(child => ToJson(child));
            }

            if (c is ArtefactQuestion)
            {
                // probably easier than using an ExpandoObject - TODO if this 
                // method grows
                return new {
                    c.Id,
                    c.Body,
                    c.AuthorId,
                    c.ArtefactId,
                    c.ParentCommentId,
                    ChildComments = childJson ?? new List<object>(),
                    ((ArtefactQuestion) c).AnswerCommentId,  // 'c.AnswerComment' will be in ChildComments 
                    ((ArtefactQuestion) c).IsAnswered,
                };
            }

            return new {
                c.Id,
                c.Body,
                c.AuthorId,
                c.ArtefactId,
                c.ParentCommentId,
                ChildComments = childJson ?? new List<object>(),
            };
        }
    }
}
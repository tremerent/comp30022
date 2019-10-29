using System.Collections.Generic;
using System.Linq;

using Artefactor.Models;

namespace Artefactor.Services.Converters
{
    public class ArtefactCommentConverter : IConverter<ArtefactComment>
    {
        public object ToJson(ArtefactComment c)
        {

            if (c is ArtefactQuestion)
            {
                // probably easier than using an ExpandoObject - TODO if this
                // method grows
                return new {
                    c.Id,
                    c.Body,
                    author = c.Author.UserName,
                    artefact = c.ArtefactId,
                    authorImageUrl = c.Author.ImageUrl,
                    replies = c.ChildComments == null ?
                                    new List<string>()
                                :
                                    c.ChildComments.Select(c => c.Id).ToList(),
                    parent = c.ParentCommentId,
                    type = "question",
                    ts = c.CreatedAt,
                    answer =    ((ArtefactQuestion)c).AnswerComment == null ?
                                    null
                                :
                                    ((ArtefactQuestion)c).AnswerComment.Id,
                };
            }

            return new {
                c.Id,
                c.Body,
                author = c.Author.UserName,
                authorImageUrl = c.Author.ImageUrl,
                artefact = c.ArtefactId,
                replies = c.ChildComments == null ?
                                new List<string>()
                            :
                                c.ChildComments.Select(c => c.Id).ToList(),
                parent = c.ParentCommentId,
                type = "comment",
                ts = c.CreatedAt,
            };
        }
    }
}

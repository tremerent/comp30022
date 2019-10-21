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
                    author = c.Author.UserName,
                    artefact = c.ArtefactId,
                    authorImageUrl = c.Author.ImageUrl,
                    replies = childJson ?? new List<object>(),
                    type = "question",
                    ts = c.CreatedAt,
                };
            }

            return new {
                c.Id,
                c.Body,
                author = c.Author.UserName,
                authorImageUrl = c.Author.ImageUrl,
                artefact = c.ArtefactId,
                replies = childJson ?? new List<object>(),
                type = "comment",
                ts = c.CreatedAt,
            };
        }
    }
}

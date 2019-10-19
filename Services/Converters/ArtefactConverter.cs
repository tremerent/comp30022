using System.Linq;

using Artefactor.Models;

namespace Artefactor.Services.Converters
{
    public class ArtefactConverter : IConverter<Artefact>
    {
        /**
        * 'a' must have owner and category join non-null, or this method will
        * return null.
        */
        public object ToJson(Artefact a)
        {
            object owner = null;
            if (a.Owner != null)
            {
                owner = RestrictedObjAppUserView(a.Owner);
            }


            object categoryJoin = null;
            if (a.CategoryJoin != null)
            {
                categoryJoin = 
                    a.CategoryJoin
                    .Select(cj => RestrictedObjCategoryJoinView(cj));
            }

            object images = null;
            if (a.Images != null)
            {
                images = a.Images
                    // TODO - use converter
                    .Select(img => new {
                        id      = img.Id,
                        title   = img.Title,
                        url     = img.Url,
                        type    = img.DocType,
                    });
            }

            return new
            {
                a.Id,
                a.Title,
                a.Description,
                a.CreatedAt,
                a.Visibility,

                images,
                owner,
                categoryJoin,
            };

            // Prepare an 'ApplicationUser' for returning to a client.
            object RestrictedObjAppUserView(ApplicationUser u)
            {
                return new
                {
                    u.Id,
                    Username = u.UserName,
                    u.Bio,
                };
            }

            // Prepare an 'CategoryJoin' for returning to a client.
            // 'cj' must have 'cj.Category' and 'cj.Artefact' loaded.
            object RestrictedObjCategoryJoinView(ArtefactCategory cj)
            {
                var category = new
                {
                    cj.Category.Name,
                };
                var artefact = new
                {
                    cj.Artefact.Title,
                };

                return new
                {
                    cj.CategoryId,
                    category,
                    cj.ArtefactId,
                    artefact,
                };
            }
        }
    }
}

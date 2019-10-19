using System;
using System.Collections.Generic;

using Artefactor.Models;

namespace Artefactor.Shared
{
    public class QueryException : Exception
    {
        // the query is unauthorised
        public bool IsAuth { get; set; } = false;
        // the query is malformed in some manner
        public bool IsQuery { get; set; } = false;
        public string Cause { get; set; } = "";
    }

    /**
     * Functions for implementation of an endpoint that accepts queries.
     */
    public class Queries
    {
        // convert a query value list of form "&query=item1,item2,..."
        public static IList<string> QueryStringValueList(string queryStringListValue)
        {
            return queryStringListValue.Split(",");
        }

        // convert a visString to an enum, throwing a QueryException if
        // string invalid
        public static Visibility VisStringQueryToEnum(string visString)
        {
            Visibility visEnum;
            if (Enum.TryParse(visString, true, out visEnum))
            {
                if (visEnum == Visibility.Unspecified)
                {
                    // user should not specify a 0 or null visibility value
                    ThrowVisQueryConversionException();
                    return Visibility.Unspecified;
                }
                else
                {
                    return visEnum;
                }
            }
            else
            {
                // user did not specify a valid visibility query
                ThrowVisQueryConversionException();
                return Visibility.Unspecified;
            }

            void ThrowVisQueryConversionException()
            {
                throw new QueryException
                { 
                    IsQuery = true, 
                    Cause = 
                        $"Invalid visibility query '{visString}'",
                };
            }
        }

        // assumes 'vis != Visibility.Unspecified'
        public static bool QueryIsAuthorised(
            Visibility vis, 
            // current app user
            ApplicationUser curUser, 
            // &user=
            ApplicationUser queryUser,
            // first arg. should be curUser
            Func<ApplicationUser, ApplicationUser, bool> HasPrivateAuthorisation,
            Func<ApplicationUser, ApplicationUser, bool> HasFamilyAuthorisation)
        {
            switch (vis)
            {
                case Visibility.Unspecified:
                    throw new ArgumentException(
                        "param. 'vis' cannot equal Visibility.Unspecified"
                    );
                case Visibility.Public:
                    return true;
                case Visibility.PrivateFamily:
                    if (queryUser == null || curUser == null)
                    {
                        return false;
                    }
                    else
                    {
                        return HasFamilyAuthorisation(curUser, queryUser);
                    }
                case Visibility.Private:
                    if (queryUser == null || curUser == null)
                    {
                        return false;
                    }
                    else
                    {
                        return HasPrivateAuthorisation(curUser, queryUser);
                    }
                default:
                    // this should never be reached, notify
                    throw new InvalidOperationException("Unreachable code.");
            }
        }
    }
}
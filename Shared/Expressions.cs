using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

using Artefactor.Models;

namespace Artefactor.Shared
{
    /**
     * Various functions used when implementing endpoint filtering using 
     * expression trees. See 
     * https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/expression-trees/how-to-use-expression-trees-to-build-dynamic-queries
     */
    public class QueryExpressions
    {
        public static MethodCallExpression GetWhereExp<T>(
            Expression whereExpBody,
            ParameterExpression paramExp,
            IQueryable<T> data)
        {
            return Expression.Call(
                typeof(Queryable),
                "Where",
                new Type[] { data.ElementType },
                data.Expression,
                Expression.Lambda<Func<T, bool>>(
                    whereExpBody, new ParameterExpression[] { paramExp })
                );
        }

        /// linq query expressions

        // Query property of artefact by 'query'.
        public static Expression ArtefactStrQueryExpression(
            string query, string property,
            ParameterExpression artefactParamExp)
        {
            // a.property

            var paramProperty = Expression.Property(
                artefactParamExp, typeof(Artefact).GetProperty(property)
            );

            // a.property.ToLower()

            var paramPropertyLowered = Expression.Call(
                paramProperty,
                typeof(string).GetMethod("ToLower", System.Type.EmptyTypes)
            );

            var paramPropertyQueryExpr = 
                StrContainsQuery(paramPropertyLowered, query);

            return paramPropertyQueryExpr;

            MethodCallExpression StrContainsQuery(Expression strExpression, string rawQuery)
            {
                return Expression.Call(
                        strExpression,
                        typeof(string).
                            GetMethod("Contains", new[] { typeof(string) }),
                        Expression.Constant(rawQuery.ToLower(), typeof(string))
                    );
            }
        }

        // returns the raw query - authentication is assumed
        public static Expression ArtefactVisQueryExpression(Visibility vis, 
            ParameterExpression artefactParamExp)
        {
            var paramVis = Expression.Property(
                artefactParamExp, typeof(Artefact).GetProperty("Visibility")
            );

            return Expression.Equal(Expression.Constant(vis), paramVis);
        }

        // artefact => artefact.OwnerId == userId
        public static Expression ArtefactUserQueryExpression(string userId, 
            ParameterExpression artefactParamExp)
        {
            var paramOwnerId = Expression.Property(
                artefactParamExp, typeof(Artefact).GetProperty("OwnerId")
            );

            return Expression.Equal(Expression.Constant(userId), paramOwnerId);
        }

        public static Expression CategoryQueryExpression(string categoryName,
            ParameterExpression artefactParamExp)
        {
            // a => a.CategoryJoin.Any(cj => cj.Category.Name == category)

            var queryCategory = Expression.Constant(categoryName);

            // cj.Category.Name
            var cjExp = 
                Expression.Parameter(typeof(ArtefactCategory));
            var cjCategoryNameExp = Expression.Property(
                Expression.Property(cjExp, "Category"), 
            "Name");

            // cj.Category.Name == category
            var condition = Expression.Equal(queryCategory, cjCategoryNameExp);

            // cj => cj.Category.Name == category
            var predicate = Expression.Lambda<Func<ArtefactCategory, bool>>(
                condition,
                cjExp
            );

            // a.CategoryJoin
            Expression paramCategoryJoin = Expression.Property(
                artefactParamExp, typeof(Artefact).GetProperty("CategoryJoin")
            );

            var expBody = Expression.Call(
                typeof(Enumerable),
                "Any",
                new Type[] { typeof(ArtefactCategory) },
                paramCategoryJoin,
                predicate
            );

            return expBody;
        }

        
        // If 'isSince' true, the expression returned is represented by
        // 'a => queryDate.CreatedAt.CompareTo(a.CreatedAt) <= 0'.
        // Otherwise,
        // 'a => queryDate.CreatedAt.CompareTo(a.CreatedAt) >= 0'
        public static Expression ArtefactCreatedAtQueryExpression(
            DateTime queryDate,
            bool isSince,  // if false, then the filter will be 
            ParameterExpression artefactParamExp)
        {
            var paramCreatedAt = Expression.Property(
                artefactParamExp, typeof(Artefact).GetProperty("CreatedAt")
            );

            // queryDate.CompareTo(artefact.CreatedAt)
            var comparison = Expression.Call(
                typeof(DateTime).GetMethod("Compare"),
                Expression.Constant(queryDate),
                paramCreatedAt
            );

            if (isSince) 
            {
                return Expression.LessThanOrEqual(
                    comparison, 
                    Expression.Constant(0)
                );
            }
            else
            {
                return Expression.GreaterThanOrEqual(
                    comparison, 
                    Expression.Constant(0)
                );
            }
        }

        /// helpers

        // OrderBy<TSource, TKey>
        // Q - queryable type
        // R - return type of orderByExpBody
        public static MethodCallExpression GetOrderByExp<Q, R>(
        Expression toOrder,  // Queryable<T>
        Expression orderByExpBody,
        ParameterExpression paramExp,
        bool isDesc = false)
        {
            return Expression.Call(
                typeof(Queryable),
                isDesc ? "OrderByDescending" : "OrderBy",
                new Type[] { typeof(Q), typeof(R) },
                toOrder,
                Expression.Lambda<Func<Q, R>>(
                    orderByExpBody, new ParameterExpression[] { paramExp })
                );
        }
        

        // Fold a number of lambdas with return type bool, 
        // using 'booleanBinOpExp'. 
        //
        // 'booleanBinOpExp' should evaluate to bool or things will break.
        //
        // It would be really cool if this was typed properly, but it's
        // just not practical right now.
        public static Expression FoldBoolLambdas(
            Expression start, // should be bool
            IEnumerable<Expression> boolLambdas,  // 
            Func<Expression, Expression, BinaryExpression> booleanBinOpExp)
        {
            // why this no work?
            // if (!(booleanBinOpExp.Conversion.ReturnType is bool))
            // {
            // }

            return boolLambdas
                .Aggregate(
                    start,
                    (acc, whereLambda) => booleanBinOpExp(acc, whereLambda)
                );
        }

        // T - type being counted
        public static Expression CountExpression<T>(
            Expression toCountExp) // <IEnumerable<T>>
        {
            var countMethod = 
                typeof(Enumerable)
                .GetMethods()
                .Single(method => method.Name == "Count" && 
                        method.IsStatic && 
                        method.GetParameters().Length == 1);
                        
            var countCallExp = Expression.Call(
                countMethod.MakeGenericMethod(typeof(T)),
                toCountExp
                // ^^ hacky for -
                // ```
                //     typeof(Enumerable)
                //     .GetMethod("Count", new Type[] { typeof(T) })
                // ```
                // which didn't work ?
            );

            return countCallExp;
        }

        // T is type of propertyName
        public static Expression ArtefactPropertyExpression<T>(
            string propertyName,
            ParameterExpression artefactParam)
        {
            return Expression.Property(
                artefactParam, 
                typeof(Artefact)
                    .GetProperty(propertyName, typeof(T))
            );
        }
    }
}

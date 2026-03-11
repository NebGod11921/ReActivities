using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Infrastructure.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities.Queries
{
    public class GetActivityList
    {
       
        public class Query : IRequest<Result<PagedList<ActivityDTOs, DateTime?>>>
        {
            public required ActivitiesParams Params { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Query, Result<PagedList<ActivityDTOs, DateTime?>>>
        {

            public async Task<Result<PagedList<ActivityDTOs, DateTime?>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = context.Activities
                     .OrderBy(a => a.Date)
                     .Where(x => x.Date >= (request.Params.Cursor ?? request.Params.StartDate))
                     .AsQueryable();


                if(!string.IsNullOrEmpty(request.Params.Filter))
                {
                    query = request.Params.Filter switch
                    {
                        "isGoing" => query.Where(x => x.ActivityAttendees.Any(a => a.UserId == userAccessor.GetUserId())),
                        "isHost" => query.Where(x => x.ActivityAttendees.Any(a => a.IsHost && a.UserId == userAccessor.GetUserId())),
                        _ => query //default case
                    };
                }

                var projectedActivities = query.ProjectTo<ActivityDTOs>
                    (mapper.ConfigurationProvider, new { currentUserId = userAccessor.GetUserId() });



                var activities = await projectedActivities
                    .Take(request.Params.PageSize + 1) //fetch one more record to check if there is a next page
                    .ToListAsync(cancellationToken); 

                DateTime? nextCursor = null;
                if(activities.Count > request.Params.PageSize)
                {
                    nextCursor = activities.Last().Date;
                    activities.RemoveAt(activities.Count - 1); //remove the extra record
                }
                return Result<PagedList<ActivityDTOs, DateTime?>>.Success(
                    new PagedList<ActivityDTOs, DateTime?>
                    {
                        Items = activities,
                        NextCursor = nextCursor,
                    });

            }

            
        }

    }
}

using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles.Queries
{
    public class GetUserActivities
    {
        public class Query : IRequest<Result<List<UserActivityDTO>>>
        {
            public required string UserId { get; set; }
            public required string Filter { get; set; }
        }
        public class Handler(AppDbContext context, IMapper mapper)
        : IRequestHandler<Query, Result<List<UserActivityDTO>>>
        {
            public async Task<Result<List<UserActivityDTO>>> Handle(Query request,
            CancellationToken cancellationToken)
            {
                var query = context.ActivityAttendees
                    .Where(u => u.User.Id == request.UserId)
                    .OrderBy(a => a.Activity.Date)
                    .Select(x => x.Activity)
                    .AsQueryable();
                var today = DateTime.UtcNow;
                query = request.Filter switch
                {
                    "past" => query.Where(a => a.Date <= today
    
                        && a.ActivityAttendees.Any(x => x.UserId == request.UserId)),
                    "hosting" => query.Where(a => a.ActivityAttendees.Any(x => x.IsHost
                    && x.UserId == request.UserId)),
                    _ => query.Where(a => a.Date >= today
                        && a.ActivityAttendees.Any(x => x.UserId == request.UserId))
                };
                var projectedActivities = query
                    .ProjectTo<UserActivityDTO>(mapper.ConfigurationProvider);
                var activities = await projectedActivities.ToListAsync(cancellationToken);
                return Result<List<UserActivityDTO>>.Success(activities);
            }
        }
    }

}

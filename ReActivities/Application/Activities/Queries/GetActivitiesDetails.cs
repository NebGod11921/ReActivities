using Application.Activities.DTOs;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities.Queries
{
    public class GetActivitiesDetails
    {
        public class Query : IRequest<Result<ActivityDTOs>>
        {
            public required string Id { get; set; }
        }

        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<ActivityDTOs>>
        {
            public async Task<Result<ActivityDTOs>> Handle(Query request, CancellationToken cancellationToken)
            {
                //step 1
                //var activity = await context.Activities
                //    .Include(x => x.ActivityAttendees)
                //    .ThenInclude(u => u.User)
                //    .FirstOrDefaultAsync(x => request.Id == x.Id, cancellationToken);


                //step 2
                var activity = await context.Activities
                   .ProjectTo<ActivityDTOs>(mapper.ConfigurationProvider)
                   .FirstOrDefaultAsync(x => request.Id == x.Id, cancellationToken);



                if (activity == null)
                {
                    return Result<ActivityDTOs>.Failure("Activity not found", 404);
                }

                //step 1
                //return Result<ActivityDTOs>.Success(mapper.Map<ActivityDTOs>(activity));

                //step 2
                return Result<ActivityDTOs>.Success(activity);
            }
        }
    }
}

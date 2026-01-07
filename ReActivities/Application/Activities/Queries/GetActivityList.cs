using Application.Activities.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
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
        public class Query : IRequest<List<ActivityDTOs>> { }

        public class Handler(AppDbContext context, ILogger<GetActivityList> logger, IMapper mapper) : IRequestHandler<Query, List<ActivityDTOs>>
        {

            public async Task<List<ActivityDTOs>> Handle(Query request, CancellationToken cancellationToken)
            {
                //try
                //{
                //    for(int i = 0; i < 5; i++)
                //    {
                //        cancellationToken.ThrowIfCancellationRequested();
                //        //await Task.Delay(1000, cancellationToken);
                //        logger.LogInformation($"Task {i} has completed.");
                //    }
                //}
                //catch(Exception ex)
                //{
                //    logger.LogInformation("Task was cancelleds");
                //}


                //step 1

                //return await context.Activities.ToListAsync(cancellationToken);


                //step 2

                return await context.Activities.ProjectTo<ActivityDTOs>(mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken); 
            }
        }

    }
}

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
        public class Query : IRequest<List<Activity>> { }

        public class Handler(AppDbContext context, ILogger<GetActivityList> logger) : IRequestHandler<Query, List<Activity>>
        {

            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    for(int i = 0; i < 5; i++)
                    {
                        cancellationToken.ThrowIfCancellationRequested();
                        //await Task.Delay(1000, cancellationToken);
                        logger.LogInformation($"Task {i} has completed.");
                    }
                }
                catch(Exception ex)
                {
                    logger.LogInformation("Task was cancelleds");
                }




                return await context.Activities.ToListAsync(cancellationToken);
            }
        }

    }
}

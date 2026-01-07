using Application.Core;
using Domain;
using Infrastructure.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities.Commands
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required string Id { get; set; }
        }


        public class Handler(IUserAccessor userAccessor, AppDbContext context) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
               var activity = await context.Activities
                    .Include(x => x.ActivityAttendees)
                    .ThenInclude(x => x.User)
                    .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
                if (activity == null) 
                    return Result<Unit>.Failure("Activity not found", 404);
                var user = await userAccessor.GetUserAsync();
                
                var attendee = activity.ActivityAttendees
                    .FirstOrDefault(x => x.UserId == user.Id);
                var isHost = activity.ActivityAttendees.Any(x => x.IsHost && x.UserId == user.Id);
                if (attendee != null )
                {
                    if(isHost) activity.IsCancelled = !activity.IsCancelled;
                    else activity.ActivityAttendees.Remove(attendee);
                } else
                {
                    activity.ActivityAttendees.Add(new ActivityAttendee
                    {
                        UserId = user.Id,
                        ActivityId = activity.Id,
                        IsHost = false
                    });
                    
                }
                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<Unit>.Success(Unit.Value) :
                    Result<Unit>.Failure("Failed to update attendance", 500);
            }
        }
    }
}

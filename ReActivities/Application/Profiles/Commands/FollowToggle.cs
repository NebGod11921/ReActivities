using Application.Core;
using Domain;
using Infrastructure.Interfaces;
using MediatR;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles.Commands
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public required string TargetUserId { get; set; } 
        }

        public class Handler(AppDbContext context, IUserAccessor userAccessor) : IRequestHandler<Command, Result<Unit>>
        {
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await userAccessor.GetUserAsync();

                var target = await context.Users.FindAsync([request.TargetUserId], cancellationToken);

                if(target == null) return Result<Unit>.Failure("User not found", 404);


                var following = await context.Followings.FindAsync([observer.Id, target.Id], cancellationToken);

                if(following == null)
                {
                    context.Followings.Add(new UserFollowing
                    { 
                        ObserverId = observer.Id,
                        TargetId = target.Id
                    });
                }
                else
                {
                    context.Followings.Remove(following);
                }
                return await context.SaveChangesAsync(cancellationToken) > 0
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Failure("Failed to update following", 400);

            }
        }
    }
}

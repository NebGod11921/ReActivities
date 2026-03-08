using Application.Core;
using Application.Profiles.DTOs;
using AutoMapper;
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

namespace Application.Profiles.Commands
{
    public class AddComment
    {
        public class Command : IRequest<Result<CommentDTO>> 
        { 
        
            public required string Body { get; set; }
            public required string ActivityId { get; set; }
        
        }

        public class Handler(AppDbContext context, IMapper mapper, IUserAccessor userAccessor) : IRequestHandler<Command, Result<CommentDTO>>
        {
            public async Task<Result<CommentDTO>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await context.Activities.Include(a => a.Comments)
                .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(a => a.Id == request.ActivityId, cancellationToken);

                if (activity == null) return Result<CommentDTO>.Failure("Activity not found", 404);
            
                var user = await userAccessor.GetUserAsync();

                var comment = new Comment
                {
                    UserId = user.Id,
                    ActivityId = activity.Id,
                    Body = request.Body

                };
                activity.Comments.Add(comment);


                var result = await context.SaveChangesAsync(cancellationToken) > 0;

                return result ? Result<CommentDTO>.Success(mapper.Map<CommentDTO>(comment)) : Result<CommentDTO>.Failure("Failed to add comment", 404);

            }
        }
    }
}

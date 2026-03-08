using Application.Core;
using Application.Profiles.DTOs;
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

namespace Application.Activities.Queries
{

    public class GetComments
    {
        public class Query : IRequest<Result<List<CommentDTO>>>
        {
            public required string ActivityId { get; set; }
        }

        public class Handler(AppDbContext context, IMapper mapper) : IRequestHandler<Query, Result<List<CommentDTO>>>
        {
            public async Task<Result<List<CommentDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var comments = await context.Comments
                    .Where(c => c.ActivityId == request.ActivityId)
                    .OrderByDescending(c => c.CreateAt)
                    .ProjectTo<CommentDTO>(mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                return Result<List<CommentDTO>>.Success(comments);

            }
        }
    }
}

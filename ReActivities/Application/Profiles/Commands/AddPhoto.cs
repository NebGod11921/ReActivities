using Application.Core;
using Application.Interfaces;
using Domain;
using Infrastructure.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles.Commands
{
    public class AddPhoto
    {
        public class Command : IRequest<Result<Photo>>
        {
            public required IFormFile File { get; set; }
        }


        public class Handler(IUserAccessor userAccessor, AppDbContext context, IPhotoService photoService) : IRequestHandler<Command, Result<Photo>>
        {
            
            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var uploadresult = await photoService.UploadPhoto(request.File);

                if (uploadresult == null) return Result<Photo>.Failure("Problem uploading photo", 400);
            
                var user = await userAccessor.GetUserAsync();


                var photo = new Photo
                {
                    Url = uploadresult.Url,
                    PublicId = uploadresult.PublicId,
                    UserId = user.Id
                };
                user.ImageUrl ??= photo.Url;

                context.Photos.Add(photo);


                var result = await context.SaveChangesAsync(cancellationToken) > 0;
                

                return result ? Result<Photo>.Success(photo) : Result<Photo>.Failure("Problem adding photo", 400);
            }
        }
    }
}

using Application.Activities.DTOs;
using Application.Profiles.DTOs;
using AutoMapper;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string? currentUserId = null;
            CreateMap<Activity, Activity>();
            CreateMap<Activity, CreateActivityDto>().ReverseMap();
            CreateMap<Activity, EditActivityDto>().ReverseMap();
            //CreateMap<BaseActivityDto, EditActivityDto>().ReverseMap();
            //CreateMap<BaseActivityDto, CreateActivityDto>().ReverseMap();

            CreateMap<Activity, ActivityDTOs>()
                .ForMember(d => d.HostDisplayName, o => o.MapFrom(s => 
                s.ActivityAttendees.FirstOrDefault(x => x.IsHost)!.User.DisplayName))
                .ForMember(d => d.HostId, o => o.MapFrom(s =>
                s.ActivityAttendees.FirstOrDefault(x => x.IsHost)!.User.Id)).ReverseMap();

            CreateMap<ActivityAttendee, UserProfile>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.User.Bio))
                .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl))
                .ForMember(d => d.Id, o => o.MapFrom(s => s.User.Id))
                .ForMember(d => d.FollowingsCount, o => o.MapFrom(s => s.User.Followings.Count))
                     .ForMember(d => d.Following, o => o.MapFrom(s => s.User.Followers.Any(x => x.ObserverId == currentUserId)))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.User.Followers.Any(x => x.ObserverId == currentUserId)));

            CreateMap<User, UserProfile>()
                    .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
                     .ForMember(d => d.FollowingsCount, o => o.MapFrom(s => s.Followings.Count))
                     .ForMember(d => d.Following, o => o.MapFrom(s => s.Followers.Any(x => x.ObserverId == currentUserId)));

            CreateMap<Comment, CommentDTO>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
                .ForMember(d => d.ImageUrl, o => o.MapFrom(s => s.User.ImageUrl))
                .ForMember(d => d.UserId, o => o.MapFrom(s => s.User.Id)).ReverseMap();
            CreateMap<Activity, UserActivityDTO>().ReverseMap();

        }
    }
}

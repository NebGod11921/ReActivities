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
                .ForMember(d => d.ImageUrls, o => o.MapFrom(s => s.User.ImageUrl))
                .ForMember(d => d.Id, o => o.MapFrom(s => s.User.Id));


        }
    }
}

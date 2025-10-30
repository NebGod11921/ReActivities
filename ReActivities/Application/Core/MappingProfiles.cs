using Application.Activities.DTOs;
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
        
        }
    }
}

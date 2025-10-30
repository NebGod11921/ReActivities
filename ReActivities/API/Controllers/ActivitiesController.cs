﻿using Application.Activities.Commands;
using Application.Activities.DTOs;
using Application.Activities.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

    //(AppDbContext context)
    public class ActivitiesController : BaseApiController
    {

    //No need to inject Mediator cuuz it's already setup in BassicAPIController

    [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities(CancellationToken ct)
        {
            return await Mediator.Send(new GetActivityList.Query(), ct);    

        }
    [HttpGet("{id}")]
    public async Task<ActionResult<Activity>> GetActivityDetails(string id)
    {
       return HandleResult( await Mediator.Send(new GetActivitiesDetails.Query { Id = id }));
        
    }
    [HttpPost]
        public async Task<ActionResult<string>> CreateActivity(CreateActivityDto activity)
        {
            return HandleResult(await Mediator.Send(new CreateActivity.Command { ActivityDto = activity }));
          
        }
    [HttpPut]
    public async Task<ActionResult> EditActivity(EditActivityDto activity)
    {
        return HandleResult(await Mediator.Send(new EditActivity.Command { EditActivityDto = activity }));
       
    }
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteActivity(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteActivity.Command { Id = id }));
       
    }

}

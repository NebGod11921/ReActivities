using Application.Activities.Commands;
using Application.Activities.DTOs;
using Application.Activities.Queries;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

//(AppDbContext context)
public class ActivitiesController : BaseApiController
{

    //No need to inject Mediator cuuz it's already setup in BassicAPIController

    //[AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<List<ActivityDTOs>>> GetActivities(CancellationToken ct)
    {
        return await Mediator.Send(new GetActivityList.Query(), ct);

    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ActivityDTOs>> GetActivityDetails(string id)
    {
        return HandleResult(await Mediator.Send(new GetActivitiesDetails.Query { Id = id }));

    }
    [HttpPost]
    public async Task<ActionResult<string>> CreateActivity(CreateActivityDto activity)
    {
        return HandleResult(await Mediator.Send(new CreateActivity.Command { ActivityDto = activity }));

    }

    [HttpPut("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<ActionResult> EditActivity(string id,EditActivityDto activity)
    {

        activity.Id = id;


        return HandleResult(await Mediator.Send(new EditActivity.Command { EditActivityDto = activity }));
       
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "IsActivityHost")]
    public async Task<ActionResult> DeleteActivity(string id)
    {
        return HandleResult(await Mediator.Send(new DeleteActivity.Command { Id = id }));
       
    }

    [HttpPost("{id}/attend")]
    public async Task<ActionResult> AttendActivity(string id)
    {
        return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));

    }

}

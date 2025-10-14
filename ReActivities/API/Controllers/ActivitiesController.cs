using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

    //(AppDbContext context)
    public class ActivitiesController : BasicApiController
    {
        private readonly AppDbContext _dbContext;
        public ActivitiesController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await _dbContext.Activities.ToListAsync();
            
        }
     
    }

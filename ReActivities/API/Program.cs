using API.Middleware;
using Application.Activities.Commands;
using Application.Activities.Queries;
using Application.Activities.Validators;
using Application.Core;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(opt => 
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000","https://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddMediatR(
    x => {
        x.RegisterServicesFromAssemblyContaining<GetActivityList>();
        x.AddOpenBehavior( typeof(ValidationBehavior<,>));



    });
builder.Services.AddAutoMapper(
    typeof(GetActivityList).Assembly);
//Validations
builder.Services.AddValidatorsFromAssemblyContaining<GetActivityList>();
builder.Services.AddTransient<ExceptionMiddleware>(); // khoi tao khi can thiet
builder.Services.AddValidatorsFromAssemblyContaining<EditActivityValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateActivityValidator>();


var app = builder.Build();

// Configure the HTTP request pipeline.


app.UseHttpsRedirection();

app.UseRouting();

app.UseMiddleware<ExceptionMiddleware>();


app.UseAuthorization();

app.MapControllers();

app.UseCors("AllowReactApp");


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// small container for scoped services

//Automatically migrate database to latest version and seed data
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();
    await DbInitializer.SeedData(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
    throw;
}




app.Run();

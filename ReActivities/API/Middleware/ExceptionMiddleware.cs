
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    public class ExceptionMiddleware : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);

            }
            catch(ValidationException vex)
            {
                await HandleValidationException(context, vex);
            }


            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        private static async Task HandleValidationException(HttpContext context, ValidationException vex)
        {
            var validationErrors = new Dictionary<string, string[]>();

            if (vex.Errors is not null)
            {
                foreach(var error in vex.Errors)
                {
                    if(validationErrors.TryGetValue(error.PropertyName, out var exisitingErrors)) {
                        validationErrors[error.PropertyName] = exisitingErrors.Append(error.ErrorMessage).ToArray();
                    }else
                    {
                        validationErrors[error.PropertyName] = new[] { error.ErrorMessage };
                    }
                }
            }
            context.Response.StatusCode = StatusCodes.Status400BadRequest;

            var validationProblemDetails = new ValidationProblemDetails(validationErrors)
            {
                Status = StatusCodes.Status400BadRequest,
                Type = "ValidationFailure",
                Title = "Validation error",
                Detail = "One or more validation error has occured"
            };
            await context.Response.WriteAsJsonAsync(validationProblemDetails);
        }
        
    }
}

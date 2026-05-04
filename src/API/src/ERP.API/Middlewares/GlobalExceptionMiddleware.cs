using System.Net;
using System.Text.Json;

namespace ERP.API.Middlewares
{
    public sealed class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");

                context.Response.StatusCode = ex switch
                {
                    ArgumentException => (int)HttpStatusCode.BadRequest,
                    InvalidOperationException => (int)HttpStatusCode.BadRequest,
                    KeyNotFoundException => (int)HttpStatusCode.NotFound,
                    UnauthorizedAccessException => (int)HttpStatusCode.Forbidden,
                    _ => (int)HttpStatusCode.InternalServerError
                };
                context.Response.ContentType = "application/json";

                var response = new
                {
                    title = context.Response.StatusCode == (int)HttpStatusCode.InternalServerError ? "Server Error" : "Request Error",
                    status = context.Response.StatusCode,
                    detail = ex.Message
                };

                await context.Response.WriteAsync(
                    JsonSerializer.Serialize(response));
            }
        }
    }
}

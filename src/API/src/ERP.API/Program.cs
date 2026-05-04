using ERP.API.Extensions;
using ERP.API.Filters;
using ERP.API.Infrastructure.Routing;
using ERP.API.Middlewares;
using ERP.Identity.Extensions;
using ERP.Identity.Seed;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(options =>
{
    options.Conventions.Add(new RouteTokenTransformerConvention(new SlugifyParameterTransformer()));
    options.Filters.Add<ValidationFilter>();
});

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "ERP API",
        Version = "v1"
    });
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddAuthorization(options => options.AddCustomPolicies());
builder.Services.RegisterAllModules(builder.Configuration);

var app = builder.Build();

await SeedData.InitializeDefaultData(app);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder => builder
              .AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());

app.UseHttpsRedirection();

app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

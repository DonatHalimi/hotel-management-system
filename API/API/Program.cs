using API.Data.Context;
using API.Models.DTOs;
using API.Models.Entities;
using API.Validations;
using FluentValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("API")
              .MigrationsHistoryTable("__EFMigrationsHistory", "dbo")
    ));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IValidator<RegisterDTO>, RegisterDTOValidation>();
builder.Services.AddScoped<IValidator<UpdateUserDTO>, UpdateUserDTOValidation>();
builder.Services.AddScoped<IValidator<BulkDeleteDTO>, BulkDeleteValidation>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hotel Management API");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
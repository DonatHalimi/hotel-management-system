using API.Config;
using API.Data.Context;
using API.Models.DTOs;
using API.Services;
using API.Validations;
using DotNetEnv;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Text;
using static API.Validations.HotelValidations;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("API")
              .MigrationsHistoryTable("__EFMigrationsHistory", "dbo")
    ));

builder.Services.AddControllers(options =>
{
    options.Filters.Add<API.Filters.SanitizeValidationErrorsFilter>();
}).AddJsonOptions(options =>
{
    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Hotel Management API",
        Version = "v1"
    });
});

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Enter your JWT token",
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Validators
builder.Services.AddScoped<IValidator<BulkDeleteDTO>, BulkDeleteValidation>();
builder.Services.AddScoped<IValidator<RegisterDTO>, RegisterValidation>();
builder.Services.AddScoped<IValidator<LoginDTO>, LoginValidation>();

builder.Services.AddScoped<IValidator<CreateUserDTO>, CreateUserDTOValidation>();
builder.Services.AddScoped<IValidator<UpdateUserDTO>, UpdateUserDTOValidation>();

builder.Services.AddScoped<IValidator<CreateRoleDTO>, CreateRoleDTOValidation>();
builder.Services.AddScoped<IValidator<UpdateRoleDTO>, UpdateRoleDTOValidation>()
    ;
builder.Services.AddScoped<IValidator<CreateHotelDTO>, CreateHotelValidation>();
builder.Services.AddScoped<IValidator<UpdateHotelDTO>, UpdateHotelValidation>();

builder.Services.AddScoped<IValidator<CreateRoomDTO>, CreateRoomValidation>();
builder.Services.AddScoped<IValidator<UpdateRoomDTO>, UpdateRoomValidation>();


var jwtConfig = new JwtConfig
{
    Secret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? throw new Exception("JWT_SECRET required"),
    Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "api",
    Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "api",
    AccessTokenExpirationMinutes = int.TryParse(Environment.GetEnvironmentVariable("ACCESS_TOKEN_EXP_MINUTES"), out var m) ? m : 15,
    RefreshTokenExpirationDays = int.TryParse(Environment.GetEnvironmentVariable("REFRESH_TOKEN_EXP_DAYS"), out var d) ? d : 30
};

builder.Services.AddSingleton(jwtConfig);
builder.Services.AddSingleton<JwtService>();

var key = Encoding.UTF8.GetBytes(jwtConfig.Secret);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtConfig.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtConfig.Audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Hotel Management API");
        options.RoutePrefix = string.Empty;
        options.EnableFilter();
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
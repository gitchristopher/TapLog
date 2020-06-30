using TapLog.Application.Common.Interfaces;
using System;

namespace TapLog.Infrastructure.Services
{
    public class DateTimeService : IDateTime
    {
        public DateTime Now => DateTime.UtcNow;
    }
}

using System;
using System.Collections.Generic;
using System.Text;
using TapLog.Domain.Common;
using TapLog.Domain.Enums;

namespace TapLog.Domain.Entities
{
    public class Tap : AuditableEntity
    {
        public int Id { get; set; }
        public int TestExecutionId { get; set; } 
        public int CardId { get; set; }
        public int DeviceId { get; set; }
        public int TesterId { get; set; }
        public string CaseNumber { get; set; }
        public Result Result { get; set; }
        public Expected WasResultExpected { get; set; }
        public DateTime TimeOf { get; set; }
        public decimal? Fare { get; set; }
        public decimal? BalanceBefore { get; set; }
        public decimal? BalanceAfter { get; set; }
        public string Notes { get; set; }


        //Navigational properties
        public TestExecution TestExecution { get; set; }
        public Card Card { get; set; }
        public Device Device { get; set; }
    }
}

using AutoMapper;
using FluentValidation;
using MediatR;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using TapLog.Application.Common.Exceptions;
using TapLog.Application.Common.Interfaces;
using TapLog.Domain.Entities;
using TapLog.Domain.Enums;
namespace TapLog.Application.Tests.Commands.CreateTest
{

    public class CreateTestCommand : IRequest<int>
    {
        public string JiraTestNumber { get; set; }
        public int StageId { get; set; }
    }

    public class CreateTestCommandHandler : IRequestHandler<CreateTestCommand, int>
    {
        private readonly IApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CreateTestCommandHandler(IApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<int> Handle(CreateTestCommand request, CancellationToken cancellationToken)
        {
            //Map request to entity
            var entity = new Test
            {
                JiraTestNumber = request.JiraTestNumber
            };
            entity.StageTests = new List<StageTest>() { new StageTest { StageId = request.StageId, TestId = entity.Id} };

            _context.Tests.Add(entity);

            await _context.SaveChangesAsync(cancellationToken);

            return entity.Id;
        }
    }

}

using TapLog.Application.TodoLists.Queries.ExportTodos;
using System.Collections.Generic;

namespace TapLog.Application.Common.Interfaces
{
    public interface ICsvFileBuilder
    {
        byte[] BuildTodoItemsFile(IEnumerable<TodoItemRecord> records);
    }
}

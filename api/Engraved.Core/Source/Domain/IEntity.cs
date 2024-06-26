﻿using Engraved.Core.Domain.Schedules;

namespace Engraved.Core.Domain;

public interface IEntity : IEditable, IScheduled
{
  string? Id { get; set; }
}

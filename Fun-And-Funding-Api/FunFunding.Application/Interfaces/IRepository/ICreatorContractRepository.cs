﻿using Fun_Funding.Domain.Entity.NoSqlEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fun_Funding.Application.IRepository
{
    public interface ICreatorContractRepository : IMongoBaseRepository<CreatorContract>
    {
    }
}

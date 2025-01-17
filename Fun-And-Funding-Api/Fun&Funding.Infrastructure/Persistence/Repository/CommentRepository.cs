﻿using Fun_Funding.Application.IRepository;
using Fun_Funding.Domain.Entity.NoSqlEntities;
using Fun_Funding.Infrastructure.Persistence.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fun_Funding.Infrastructure.Persistence.Repository
{
    public class CommentRepository : MongoBaseRepository<Comment>, ICommentRepository
    {
        public CommentRepository(MongoDBContext mongoDB)
            : base(mongoDB, "comment") // Pass the collection name
        {
        }
    }
}


﻿using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fun_Funding.Domain.Entity.NoSqlEntities
{
    public class Feedback
    {
        [BsonId]
        [BsonRepresentation(BsonType.String)]
        public Guid Id { get; set; }
        public string? Content { get; set; }
        public DateTime CreateDate { get; set; }
        public Guid UserID { get; set; }
        public bool Status { get; set; }
        public bool IsDelete { get; set; }
    }
}

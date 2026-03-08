using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Profiles.DTOs
{
    public class CommentDTO
    {
        public required string Id { get; set; }

        public required string Body { get; set; }
        public DateTime CreateAt { get; set; } 

        //Navigation properties

        public required string UserId { get; set; }
        public required string DisplayName { get; set; }
        public string? ImageUrl { get; set; }
    }
}

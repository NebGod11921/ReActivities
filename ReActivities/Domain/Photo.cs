using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Domain
{
    public class Photo
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public required string Url { get; set; }

        public required string PublicId { get; set; }

        //nav props
        public required string UserId { get; set; }
        [JsonIgnore] // return response without User object
        public User User { get; set; } = null!;
    }
}

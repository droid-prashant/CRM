using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Library.Abstractions
{
    public abstract class Entity
    {
        public Guid Id { get; set; }
    }
}

using System.Text.RegularExpressions;

namespace ERP.API.Infrastructure.Routing
{
    public class SlugifyParameterTransformer : IOutboundParameterTransformer
    {
        public string? TransformOutbound(object? value)
        {
            if (value == null) return null;

            // Converts "HealthController" → "health"
            // "StudentsController" → "students"
            return Regex.Replace(value.ToString()!, "([a-z])([A-Z])", "$1-$2").ToLower();
        }
    }
}

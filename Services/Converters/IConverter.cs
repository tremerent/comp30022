namespace Artefactor.Services.Converters
{
    public interface IConverter<T>
    {
        public object ToJson(T model);
    }
}
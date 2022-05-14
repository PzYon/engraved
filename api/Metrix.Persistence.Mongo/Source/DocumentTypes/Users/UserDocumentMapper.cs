using AutoMapper;
using Metrix.Core.Domain.User;
using MongoDB.Bson.Serialization;

namespace Metrix.Persistence.Mongo.DocumentTypes.Users;

public static class UserDocumentMapper
{
  private static readonly IMapper Mapper;

  static UserDocumentMapper()
  {
    BsonClassMap.RegisterClassMap<UserDocument>();

    var configuration = new MapperConfiguration(cfg => cfg.CreateMap<IUser, UserDocument>());

    // configuration.AssertConfigurationIsValid();

    Mapper = configuration.CreateMapper();
  }

  public static UserDocument ToDocument(IUser user)
  {
    return Mapper.Map<UserDocument>(user);
  }

  public static IUser FromDocument(UserDocument document)
  {
    return Mapper.Map<IUser>(document);
  }
}

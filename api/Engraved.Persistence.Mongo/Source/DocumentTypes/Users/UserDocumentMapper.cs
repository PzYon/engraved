using AutoMapper;
using Engraved.Core.Domain.User;

namespace Engraved.Persistence.Mongo.DocumentTypes.Users;

public static class UserDocumentMapper
{
  private static readonly IMapper Mapper;

  static UserDocumentMapper()
  {
    var configuration = new MapperConfiguration(
      cfg =>
      {
        cfg.CreateMap<IUser, UserDocument>();
        cfg.CreateMap<User, UserDocument>();
        cfg.CreateMap<UserDocument, IUser>()
          .ConstructUsing(
            (document, context) => context.Mapper.Map<UserDocument, User>(document)!
          );
        cfg.CreateMap<UserDocument, User>();
      }
    );

    // configuration.AssertConfigurationIsValid();

    Mapper = configuration.CreateMapper();
  }

  public static UserDocument ToDocument(IUser user)
  {
    return Mapper.Map<UserDocument>(user)!;
  }

  public static IUser FromDocument(UserDocument document)
  {
    return Mapper.Map<IUser>(document)!;
  }
}

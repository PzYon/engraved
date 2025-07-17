using AutoMapper;
using Engraved.Core.Domain.Users;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace Engraved.Persistence.Mongo.DocumentTypes.Users;

public class UserDocumentMapper
{
  private readonly IMapper mapper;

  public UserDocumentMapper(ILoggerFactory loggerFactory)
  {
    var configuration = new MapperConfiguration(
      cfg =>
      {
        cfg.CreateMap<IUser, UserDocument>();
        cfg.CreateMap<User, UserDocument>();
        cfg.CreateMap<UserDocument, IUser>()
          .ConstructUsing((document, context) => context.Mapper.Map<UserDocument, User>(document)!
          );
        cfg.CreateMap<UserDocument, User>();
      },
      loggerFactory
    );

    // configuration.AssertConfigurationIsValid();

    mapper = configuration.CreateMapper();
  }

  public UserDocument ToDocument(IUser user)
  {
    return mapper.Map<UserDocument>(user)!;
  }

  public IUser FromDocument(UserDocument document)
  {
    return mapper.Map<IUser>(document)!;
  }
}

namespace Engraved.Core.Application.Persistence;

// The explicit non-user-scoped seam. Resolves to the raw MongoRepository, so NONE of the
// permission/user scoping applies. Inject this only where there is deliberately no current user to
// scope to: the notification job (runs across all users), authentication/login (runs before a user
// context exists) and health endpoints.
//
// This is a distinct, greppable type rather than the scoping-agnostic base IBaseRepository, so that
// "I want unscoped access" is always a conscious choice and can never be obtained by accident (e.g.
// by injecting the base of the scoped IRepository).
public interface ISystemRepository : IBaseRepository
{
}

from rest_framework import permissions

from timeTrackerapp.models import MyUser, Task


class IsSuperAdmin(permissions.BasePermission):
    """
    permission for superadmin
    """
    message = 'Not a super admin.'
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)



class IsManagerOrSuperAdmin(permissions.BasePermission):
    # permission for manager
    message = 'You have to be a manager or super admin'

    def has_permission(self, request, view):
        # roles = request.user.role
        try:
            user = MyUser.objects.get(email=request.user.email)
            return bool('manager' in user.roles or 'superadmin' in user.roles)
        except:
            return False


class IsSameUser(permissions.BasePermission):
    # permission for checking if the same user is the one that is trying to update
    message = 'different user not authorized'

    def has_permission(self, request, view):

        try:
            return bool(view.getPk() == request.user.pk )
        except:
            return False


# class IsTaskOwner(permissions.BasePermission):
#     # permission for checking if the same user is the one that is trying to update
#     message = 'different user not authorized'
#
#     def has_object_permission(self, request, view, obj: Task):
#         return bool(obj.employee.id == request.user.id)



class IsProjectOwner(permissions.BasePermission):
    # permission for checking if the same user is the one that is trying to update
    message = 'Not Project owner to modify!'

    def has_permission(self, request, view):
        try:
            return bool(view.getManager() == request.user.email)
        except:
            return False
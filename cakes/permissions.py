from rest_framework.permissions import BasePermission


class IsAdminUserRole(BasePermission):
    """
    Only staff/admin users can access Cake CRUD APIs.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.is_staff
        )
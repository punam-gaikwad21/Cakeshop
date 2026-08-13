from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test


def admin_required(view_func):

    return user_passes_test(
        lambda user: user.is_authenticated and user.is_staff,
        login_url="/login/"
    )(view_func)


@admin_required
def admin_dashboard_page(request):
    return render(
        request,
        "admin_dashboard/dashboard.html"
    )


@admin_required
def cake_list_page(request):
    return render(
        request,
        "admin_dashboard/cake_list.html"
    )


@admin_required
def cake_add_page(request):
    return render(
        request,
        "admin_dashboard/cake_add.html"
    )


@admin_required
def cake_update_page(request, pk):
    return render(
        request,
        "admin_dashboard/cake_update.html"
    )


@admin_required
def category_list_page(request):
    return render(
        request,
        "admin_dashboard/category_list.html"
    )


@admin_required
def category_add_page(request):
    return render(
        request,
        "admin_dashboard/category_add.html"
    )


@admin_required
def category_update_page(request, pk):
    return render(
        request,
        "admin_dashboard/category_update.html"
    )
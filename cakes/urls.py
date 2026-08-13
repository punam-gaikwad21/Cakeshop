from django.urls import path
from . import views

urlpatterns = [

    path(
        "admin_dashboard/",
        views.admin_dashboard_page,
        name="admin_dashboard"
    ),
    

    path(
        "cake-list/",
        views.cake_list_page,
        name="cake_list"
    ),

    path(
        "cake-add/",
        views.cake_add_page,
        name="cake_add"
    ),

    path(
        "cake-update/<int:pk>/",
        views.cake_update_page,
        name="cake_update"
    ),


    path(
    "category-list/",
    views.category_list_page,
    name="category_list"
),

path(
    "category-add/",
    views.category_add_page,
    name="category_add"
),

path(
    "category-update/<int:pk>/",
    views.category_update_page,
    name="category_update"
),

]
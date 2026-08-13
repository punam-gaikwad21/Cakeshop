from django.urls import path
from . import views

urlpatterns = [

    path(
        "shop/",
        views.shop_page,
        name="shop"
    ),

    path(
    "cake-details/<int:pk>/",
    views.cake_details_page,
    name="cake_details"
),

]
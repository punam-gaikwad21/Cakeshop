from django.urls import path

from .api_views import CartView, AddToCartView, UpdateCartItemView,  RemoveCartItemView

urlpatterns = [

    path(
        "cart/",
        CartView.as_view(),
        name="cart"
    ),

    path(
        "cart/add/",
        AddToCartView.as_view(),
        name="add_to_cart"
    ),

    path(
    "cart/update/",
    UpdateCartItemView.as_view(),
    name="update_cart"
),




    path(
        "cart/remove/<int:pk>/",
        RemoveCartItemView.as_view(),
        name="remove_cart_item"
    ),



]
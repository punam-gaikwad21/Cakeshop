from django.urls import path
from . import views


urlpatterns = [

    path(
        "order-list/",
        views.order_list_page,
        name="order_list"
    ),

    path(
        "order-details/<int:pk>/",
        views.order_details_page,
        name="order_details"
    ),

    path(
        "order-update/<int:pk>/",
        views.order_update_page,
        name="order_update"
    ),

    path(
        "payment-update/<int:pk>/",
        views.payment_update_page,
        name="payment_update"
    ),

    path(
        "checkout/",
        views.checkout_page,
        name="checkout"
    ),

    path(
        "my-orders/",
        views.my_orders_page,
        name="my_orders"
    ),

    path(
        "uorder-details/<int:pk>/",
        views.uorder_details_page,
        name="uorder_details"
    ),

]
from django.urls import path
from rest_framework.routers import DefaultRouter

from .api_views import (
    OrderViewSet,
    PlaceOrderView,
    MyOrdersView,
    OrderDetailsView,
)

router = DefaultRouter()

router.register(
    r"orders",
    OrderViewSet,
    basename="orders"
)

urlpatterns = [

    path(
        "orders/place/",
        PlaceOrderView.as_view(),
        name="place_order"
    ),

    path(
        "orders/my/",
        MyOrdersView.as_view(),
        name="my_orders"
    ),

    # Admin order detail
    path(
        "order-details/<int:pk>/",
        OrderDetailsView.as_view(),
        name="order_details"
    ),

    # User order detail
    path(
        "uorder-details/<int:pk>/",
        OrderDetailsView.as_view(),
        name="uorder_details"
    ),

] + router.urls
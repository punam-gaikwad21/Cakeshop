from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from .serializers import OrderSerializer
from cakes.permissions import IsAdminUserRole
from cakes.pagination import CakePagination

import uuid

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from orders.models import Order, OrderItem
from cart.models import Cart
from django.shortcuts import get_object_or_404



from django.db import transaction

from rest_framework import status




class OrderViewSet(viewsets.ModelViewSet):

    queryset = Order.objects.select_related(
        "customer"
    ).prefetch_related(
        "items__cake"
    )

    serializer_class = OrderSerializer

    permission_classes = [IsAdminUserRole]

    pagination_class = CakePagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = [
        "payment_status",
        "order_status",
    ]

    search_fields = [
        "order_number",
        "customer__username",
    ]

    ordering_fields = [
        "created_at",
        "total_amount",
    ]

    ordering = [
        "-created_at",
    ]



class PlaceOrderView(APIView):

    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        cart_items = cart.items.select_related("cake").all()

        if not cart_items.exists():
            return Response(
                {
                    "success": False,
                    "message": "Your cart is empty."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        for item in cart_items:
            if item.cake.status != "available":
                return Response(
                    {
                        "success": False,
                        "message": f"{item.cake.name} is out of stock."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        total = sum(
            item.quantity * item.cake.price
            for item in cart_items
        )

        order = Order.objects.create(
            customer=request.user,
            order_number=str(uuid.uuid4())[:8].upper(),
            total_amount=total
        )

        for item in cart_items:

            OrderItem.objects.create(
                order=order,
                cake=item.cake,
                quantity=item.quantity,
                price=item.cake.price,
                subtotal=item.quantity * item.cake.price
            )

        cart_items.delete()

        return Response(
            {
                "success": True,
                "message": "Order Placed Successfully",
                "order_number": order.order_number
            },
            status=status.HTTP_201_CREATED
        )


class MyOrdersView(APIView):
    

    permission_classes = [IsAuthenticated]

    def get(self, request):

        orders = Order.objects.filter(

            customer=request.user

        ).order_by("-created_at")

        serializer = OrderSerializer(

            orders,

            many=True

        )

        return Response(serializer.data)



class OrderDetailsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        order = get_object_or_404(
    Order,
    id=pk,
    customer=request.user
)
        serializer = OrderSerializer(order)

        return Response(serializer.data)    
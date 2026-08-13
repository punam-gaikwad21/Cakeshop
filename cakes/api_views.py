from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Cake
from .serializers import CakeSerializer
from .permissions import IsAdminUserRole
from .pagination import CakePagination
from rest_framework import viewsets

from .models import Category
from .serializers import CategorySerializer
from rest_framework.permissions import AllowAny

from django.contrib.auth.models import User
from django.db.models import Sum

from rest_framework.views import APIView
from rest_framework.response import Response

from orders.models import Order
from cart.models import CartItem

from rest_framework.permissions import IsAuthenticated


class CakeViewSet(viewsets.ModelViewSet):

    queryset = Cake.objects.select_related("category").all()
    serializer_class = CakeSerializer

    parser_classes = [MultiPartParser, FormParser]
    pagination_class = CakePagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ["category", "status"]

    search_fields = ["name", "description"]

    ordering_fields = ["price", "created_at", "name"]

    ordering = ["-created_at"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [AllowAny()]
        return [IsAdminUserRole()]








class CategoryViewSet(viewsets.ModelViewSet):

    queryset = Category.objects.all()

    serializer_class = CategorySerializer

    def get_permissions(self):

        if self.action in ["list", "retrieve"]:
            return [AllowAny()]

        return [IsAdminUserRole()]




class DashboardStatsView(APIView):

    permission_classes = [IsAdminUserRole]

    def get(self, request):

        total_cakes = Cake.objects.count()

        total_orders = Order.objects.count()

        total_users = User.objects.filter(
            is_staff=False
        ).count()

        total_revenue = Order.objects.filter(
            payment_status="paid"
        ).aggregate(
            total=Sum("total_amount")
        )["total"] or 0

        total_cart_items = CartItem.objects.aggregate(
            total=Sum("quantity")
        )["total"] or 0

        recent_cakes = Cake.objects.select_related(
            "category"
        ).order_by("-created_at")[:5]

        recent_orders = Order.objects.select_related(
            "customer"
        ).order_by("-created_at")[:5]

        cake_data = []

        for cake in recent_cakes:

            image_url = ""

            if cake.image:
                image_url = request.build_absolute_uri(
                    cake.image.url
                )

            cake_data.append({
                "id": cake.id,
                "name": cake.name,
                "category": cake.category.name,
                "price": str(cake.price),
                "status": cake.status,
                "image": image_url,
            })

        order_data = []

        for order in recent_orders:

            order_data.append({
                "id": order.id,
                "order_number": order.order_number,
                "customer_name": order.customer.username,
                "total_amount": str(order.total_amount),
                "payment_status": order.payment_status,
                "order_status": order.order_status,
                "created_at": order.created_at.strftime(
                    "%d %b %Y"
                ),
            })

        return Response({

            "total_cakes": total_cakes,

            "total_orders": total_orders,

            "total_users": total_users,

            "total_revenue": str(total_revenue),

            "total_cart_items": total_cart_items,

            "recent_cakes": cake_data,

            "recent_orders": order_data,

        })    
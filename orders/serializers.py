from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):

    cake_name = serializers.CharField(
        source="cake.name",
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "cake",
            "cake_name",
            "quantity",
            "price",
            "subtotal",
        ]




class OrderSerializer(serializers.ModelSerializer):

    customer_name = serializers.CharField(
        source="customer.username",
        read_only=True
    )

    items = OrderItemSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "order_number",
            "customer",
            "customer_name",
            "total_amount",
            "payment_status",
            "order_status",
            "created_at",
            "items",
        ]

        read_only_fields = [
            "id",
            "order_number",
            "customer",
            "customer_name",
            "total_amount",
            "created_at",
            "items",
        ]
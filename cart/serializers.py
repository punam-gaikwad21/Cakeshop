from rest_framework import serializers
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):

    cake_name = serializers.CharField(
        source="cake.name",
        read_only=True
    )

    cake_image = serializers.ImageField(
        source="cake.image",
        read_only=True
    )

    price = serializers.DecimalField(
        source="cake.price",
        max_digits=8,
        decimal_places=2,
        read_only=True
    )

    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "cake",
            "cake_name",
            "cake_image",
            "price",
            "quantity",
            "subtotal",
        ]

    def get_subtotal(self, obj):
        return obj.quantity * obj.cake.price


class CartSerializer(serializers.ModelSerializer):

    items = CartItemSerializer(
        many=True,
        read_only=True
    )

    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            "id",
            "items",
            "total",
        ]

    def get_total(self, obj):
        total = 0

        for item in obj.items.all():
            total += item.quantity * item.cake.price

        return total
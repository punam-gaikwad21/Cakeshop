from django.db import models
from django.contrib.auth.models import User

from cakes.models import Cake


class Cart(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="cart"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.user.username} Cart"


class CartItem(models.Model):

    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items"
    )

    cake = models.ForeignKey(
        Cake,
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField(
        default=1
    )

    class Meta:
        unique_together = ("cart", "cake")

    @property
    def subtotal(self):
        return self.quantity * self.cake.price

    def __str__(self):
        return self.cake.name
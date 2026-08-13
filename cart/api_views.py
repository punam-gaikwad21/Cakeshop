from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Cart, CartItem
from cakes.models import Cake
from .serializers import CartSerializer


class CartView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        serializer = CartSerializer(cart)

        return Response(serializer.data)



class AddToCartView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        cake_id = request.data.get("cake")
        quantity_value = request.data.get("quantity", 1)

        if not cake_id:
            return Response(
                {"error": "Cake ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            quantity = int(quantity_value)
        except (TypeError, ValueError):
            return Response(
                {"error": "Quantity must be a valid number."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity < 1:
            return Response(
                {"error": "Quantity must be at least 1."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity > 20:
            return Response(
                {"error": "You can add maximum 20 cakes at a time."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:

            cake = Cake.objects.get(id=cake_id)

        except Cake.DoesNotExist:

            return Response(
                {"error": "Cake not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if cake.status != "available":

            return Response(
                {"error": "This cake is currently out of stock."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart, created = Cart.objects.get_or_create(
            user=request.user
        )

        cart_item, created = CartItem.objects.get_or_create(

            cart=cart,

            cake=cake,

            defaults={
                "quantity": quantity
            }
        )

        if not created:

            new_quantity = cart_item.quantity + quantity

            if new_quantity > 20:
                return Response(
                    {
                        "error":
                        "Maximum 20 cakes are allowed in the cart."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            cart_item.quantity = new_quantity

            cart_item.save(
                update_fields=["quantity"]
            )

        return Response(
            {
                "message": "Cake added to cart successfully.",
                "quantity": cart_item.quantity
            },
            status=status.HTTP_200_OK
        )
class UpdateCartItemView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        item_id = request.data.get("item")

        action = request.data.get("action")

        try:

            item = CartItem.objects.get(

                id=item_id,

                cart__user=request.user

            )

        except CartItem.DoesNotExist:

            return Response(

                {"error": "Item not found"},

                status=status.HTTP_404_NOT_FOUND

            )

        if action == "increase":

            item.quantity += 1

        elif action == "decrease":

            if item.quantity > 1:

                item.quantity -= 1

        item.save()

        return Response({

            "message": "Quantity Updated"

        })



class RemoveCartItemView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        try:

            item = CartItem.objects.get(

                id=pk,

                cart__user=request.user

            )

        except CartItem.DoesNotExist:

            return Response(

                {"error": "Cart item not found."},

                status=status.HTTP_404_NOT_FOUND

            )

        item.delete()

        return Response(

            {"message": "Item removed successfully."},

            status=status.HTTP_200_OK

        )
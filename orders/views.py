from django.shortcuts import render

# Create your views here.

def order_list_page(request):

    return render(

        request,

        "orders/order_list.html"

    )
from django.shortcuts import render

def order_details_page(request, pk):

    return render(
        request,
        "orders/order_details.html"
    )

def order_update_page(request, pk):

    return render(
        request,
        "orders/order_update.html"
    )
def payment_update_page(request, pk):

    return render(
        request,
        "orders/payment_update.html"
    )


def checkout_page(request):

    return render(
        request,
        "orders/checkout.html"
    )



def my_orders_page(request):

    return render(
        request,
        "orders/my_orders.html"
    )


def uorder_details_page(request, pk):

    return render(
        request,
        "orders/uorder_details.html"
    )
from django.shortcuts import render

# Create your views here.

def shop_page(request):

    return render(
        request,
        "product/shop.html"
    )




def cake_details_page(request, pk):

    return render(
        request,
        "product/cake_details.html"
    )
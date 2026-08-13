from django.shortcuts import render
from django.contrib.auth.decorators import login_required


def register(request):
    return render(
        request,
        "accounts/register.html"
    )


def home_page(request):
    return render(
        request,
        "core/index.html"
    )


def login(request):
    return render(
        request,
        "accounts/login.html"
    )


